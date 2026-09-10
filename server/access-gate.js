const crypto = require("node:crypto");

const LOGIN_PATH = "/studio-login";

const renderLoginPage = (message = "") => `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Acessar Claw3D</title>
    <style>
      :root { color-scheme: dark; font-family: ui-sans-serif, system-ui, sans-serif; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #080b12; color: #f8fafc; }
      main { width: min(88vw, 25rem); padding: 2rem; border: 1px solid #263244; border-radius: 1rem; background: #111827; box-shadow: 0 1.5rem 4rem #0008; }
      h1 { margin: 0 0 .5rem; font-size: 1.5rem; }
      p { margin: 0 0 1.25rem; color: #aebbd0; line-height: 1.5; }
      label { display: block; margin-bottom: .5rem; font-weight: 700; }
      input { box-sizing: border-box; width: 100%; padding: .8rem; border: 1px solid #41516b; border-radius: .6rem; background: #070b12; color: white; font: inherit; }
      button { width: 100%; margin-top: 1rem; padding: .85rem; border: 0; border-radius: .6rem; background: #22c55e; color: #041109; font: inherit; font-weight: 800; cursor: pointer; }
      .error { color: #fca5a5; }
    </style>
  </head>
  <body>
    <main>
      <h1>Claw3D + Harness</h1>
      <p>Digite a senha de acesso para abrir o escritório com os 33 agentes do Harness.</p>
      ${message ? `<p class="error" role="alert">${message}</p>` : ""}
      <form method="post" action="${LOGIN_PATH}">
        <label for="token">Senha de acesso</label>
        <input id="token" name="token" type="password" required autofocus autocomplete="current-password" />
        <button type="submit">Entrar</button>
      </form>
    </main>
  </body>
</html>`;


const parseCookies = (header) => {
  const raw = typeof header === "string" ? header : "";
  if (!raw.trim()) return {};
  const out = {};
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
};

/** Constant-time string comparison to prevent timing attacks. */
const safeCompare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Compare against self to burn constant time, then return false
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
};

/** Simple in-memory rate limiter for auth attempts. */
const createRateLimiter = (maxAttempts = 10, windowMs = 60_000) => {
  const attempts = new Map();
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of attempts) {
      if (now - entry.start > windowMs) attempts.delete(key);
    }
  }, windowMs);
  cleanup.unref();

  return {
    isLimited(ip) {
      const entry = attempts.get(ip);
      if (!entry) return false;
      return entry.count >= maxAttempts;
    },
    recordFailure(ip) {
      const now = Date.now();
      const entry = attempts.get(ip);
      if (!entry || now - entry.start > windowMs) {
        attempts.set(ip, { count: 1, start: now });
        return;
      }
      entry.count++;
    },
    reset(ip) {
      attempts.delete(ip);
    },
  };
};

/**
 * Resolve client IP for rate limiting.
 * When TRUSTED_PROXY=1 is set, the first value of X-Forwarded-For is used.
 * Only set TRUSTED_PROXY=1 when this server sits behind a reverse proxy that
 * you control (nginx, Caddy, Vercel edge). Without it, X-Forwarded-For is
 * ignored to prevent spoofing by direct clients.
 */
const resolveClientIp = (req) => {
  if (process.env.TRUSTED_PROXY === "1") {
    const forwarded = req.headers?.["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
  }
  return req.socket?.remoteAddress || "unknown";
};

function createAccessGate(options) {
  const token = String(options?.token ?? "").trim();
  const cookieName = String(options?.cookieName ?? "studio_access").trim() || "studio_access";

  const enabled = Boolean(token);
  const rateLimiter = createRateLimiter(10, 60_000);

  const getAuthState = (req) => {
    if (!enabled) return { authorized: true, limited: false };
    const ip = resolveClientIp(req);
    const cookieHeader = req.headers?.cookie;
    const cookies = parseCookies(cookieHeader);
    const authorized = safeCompare(cookies[cookieName] || "", token);
    if (authorized) {
      rateLimiter.reset(ip);
      return { authorized: true, limited: false };
    }
    if (rateLimiter.isLimited(ip)) {
      return { authorized: false, limited: true };
    }
    rateLimiter.recordFailure(ip);
    return { authorized: false, limited: rateLimiter.isLimited(ip) };
  };

  const handleHttp = (req, res) => {
    if (!enabled) return false;
    const requestUrl = new URL(String(req.url || "/"), "http://studio.local");
    if (requestUrl.pathname === LOGIN_PATH && req.method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(renderLoginPage());
      return true;
    }
    if (requestUrl.pathname === LOGIN_PATH && req.method === "POST") {
      const ip = resolveClientIp(req);
      if (rateLimiter.isLimited(ip)) {
        res.statusCode = 429;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(renderLoginPage("Muitas tentativas. Aguarde um minuto e tente novamente."));
        return true;
      }
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 4096) req.destroy();
      });
      req.on("end", () => {
        const submitted = new URLSearchParams(body).get("token") || "";
        if (!safeCompare(submitted, token)) {
          rateLimiter.recordFailure(ip);
          res.statusCode = rateLimiter.isLimited(ip) ? 429 : 401;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(renderLoginPage("Senha incorreta."));
          return;
        }
        rateLimiter.reset(ip);
        const forwardedProto = String(req.headers?.["x-forwarded-proto"] || "").toLowerCase();
        const secure = Boolean(req.socket?.encrypted) || forwardedProto === "https";
        res.statusCode = 303;
        res.setHeader("Location", "/office");
        res.setHeader(
          "Set-Cookie",
          `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}`
        );
        res.end();
      });
      return true;
    }
    const auth = getAuthState(req);
    if (!auth.authorized) {
      const statusCode = auth.limited ? 429 : 401;
      if (String(req.url || "/").startsWith("/api/")) {
        res.statusCode = statusCode;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: auth.limited
              ? "Too many failed studio access attempts. Wait a minute and retry."
              : "Studio access token required. Send the configured Studio access cookie and retry.",
          })
        );
      } else {
        if (!auth.limited && (req.method === "GET" || !req.method)) {
          res.statusCode = 302;
          res.setHeader("Location", LOGIN_PATH);
          res.setHeader("Cache-Control", "no-store");
          res.end();
        } else {
          res.statusCode = statusCode;
          res.setHeader("Content-Type", "text/plain");
          res.end(
            auth.limited
              ? "Too many failed studio access attempts. Wait a minute and retry."
              : "Studio access token required. Set the studio_access cookie to access this page."
          );
        }
      }
      return true;
    }
    return false;
  };

  const allowUpgrade = (req) => {
    if (!enabled) return true;
    return getAuthState(req).authorized;
  };

  return { enabled, handleHttp, allowUpgrade };
}

module.exports = { createAccessGate };

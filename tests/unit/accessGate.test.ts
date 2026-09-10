// @vitest-environment node

import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";

describe("createAccessGate", () => {
  it("allows when token is unset", async () => {
    const { createAccessGate } = await import("../../server/access-gate");
    const gate = createAccessGate({ token: "" });
    expect(gate.allowUpgrade({ headers: {} })).toBe(true);
  });

  it("rejects /api requests without cookie when enabled", async () => {
    const { createAccessGate } = await import("../../server/access-gate");
    const gate = createAccessGate({ token: "abc" });

    let statusCode = 0;
    let ended = false;
    const res = {
      setHeader: () => {},
      end: () => {
        ended = true;
      },
      get statusCode() {
        return statusCode;
      },
      set statusCode(value: number) {
        statusCode = value;
      },
    };

    const handled = gate.handleHttp(
      { url: "/api/studio", headers: { host: "example.test" } },
      res
    );

    expect(handled).toBe(true);
    expect(statusCode).toBe(401);
    expect(ended).toBe(true);
  });

  it("allows upgrades when cookie matches", async () => {
    const { createAccessGate } = await import("../../server/access-gate");
    const gate = createAccessGate({ token: "abc" });
    expect(
      gate.allowUpgrade({ headers: { cookie: "studio_access=abc" } })
    ).toBe(true);
  });

  it("serves a login page and creates a protected cookie for the right password", async () => {
    const { createAccessGate } = await import("../../server/access-gate");
    const gate = createAccessGate({ token: "correct horse" });
    const req = new EventEmitter() as EventEmitter & Record<string, unknown>;
    req.url = "/studio-login";
    req.method = "POST";
    req.headers = { "x-forwarded-proto": "https" };
    req.socket = { remoteAddress: "127.0.0.1" };
    const headers = new Map<string, string>();
    let statusCode = 0;
    const ended = new Promise<void>((resolve) => {
      const res = {
        setHeader: (name: string, value: string) => headers.set(name, value),
        end: () => resolve(),
        get statusCode() {
          return statusCode;
        },
        set statusCode(value: number) {
          statusCode = value;
        },
      };
      expect(gate.handleHttp(req, res)).toBe(true);
    });

    req.emit("data", Buffer.from("token=correct+horse"));
    req.emit("end");
    await ended;

    expect(statusCode).toBe(303);
    expect(headers.get("Location")).toBe("/office");
    expect(headers.get("Set-Cookie")).toContain("studio_access=correct%20horse");
    expect(headers.get("Set-Cookie")).toContain("HttpOnly");
    expect(headers.get("Set-Cookie")).toContain("Secure");
    expect(
      gate.allowUpgrade({ headers: { cookie: headers.get("Set-Cookie") } })
    ).toBe(true);
  });

  it("returns 429 after repeated failed attempts", async () => {
    const { createAccessGate } = await import("../../server/access-gate");
    const gate = createAccessGate({ token: "abc" });

    const createResponse = () => {
      let statusCode = 0;
      let body = "";
      return {
        setHeader: () => {},
        end: (value?: string) => {
          body = value ?? "";
        },
        get statusCode() {
          return statusCode;
        },
        set statusCode(value: number) {
          statusCode = value;
        },
        get body() {
          return body;
        },
      };
    };

    for (let index = 0; index < 9; index++) {
      const res = createResponse();
      gate.handleHttp(
        { url: "/api/studio", headers: {}, socket: { remoteAddress: "127.0.0.1" } },
        res
      );
      expect(res.statusCode).toBe(401);
    }

    const limited = createResponse();
    gate.handleHttp(
      { url: "/api/studio", headers: {}, socket: { remoteAddress: "127.0.0.1" } },
      limited
    );

    expect(limited.statusCode).toBe(429);
    expect(limited.body).toContain("Too many failed studio access attempts");
  });

  it("recovers immediately when a valid cookie is sent after throttling", async () => {
    const { createAccessGate } = await import("../../server/access-gate");
    const gate = createAccessGate({ token: "abc" });

    const createResponse = () => {
      let statusCode = 0;
      let body = "";
      return {
        setHeader: () => {},
        end: (value?: string) => {
          body = value ?? "";
        },
        get statusCode() {
          return statusCode;
        },
        set statusCode(value: number) {
          statusCode = value;
        },
        get body() {
          return body;
        },
      };
    };

    for (let index = 0; index < 10; index++) {
      const res = createResponse();
      gate.handleHttp(
        { url: "/api/studio", headers: {}, socket: { remoteAddress: "127.0.0.1" } },
        res
      );
    }

    expect(
      gate.allowUpgrade({
        headers: { cookie: "studio_access=abc" },
        socket: { remoteAddress: "127.0.0.1" },
      })
    ).toBe(true);

    const recovered = createResponse();
    gate.handleHttp(
      {
        url: "/api/studio",
        headers: { cookie: "studio_access=abc" },
        socket: { remoteAddress: "127.0.0.1" },
      },
      recovered
    );

    expect(recovered.statusCode).toBe(0);

    const afterReset = createResponse();
    gate.handleHttp(
      { url: "/api/studio", headers: {}, socket: { remoteAddress: "127.0.0.1" } },
      afterReset
    );

    expect(afterReset.statusCode).toBe(401);
    expect(afterReset.body).toContain("Studio access token required");
  });
});

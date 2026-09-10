import { describe, expect, it } from "vitest";

const { agents, DEFAULT_AGENT_ID, handleMethod } = await import("../../server/demo-gateway-adapter.js");

describe("demo-gateway-adapter", () => {
  it("loads every specialist from the installed Harness manifest", async () => {
    const result = await handleMethod("agents.list", {}, "agents", () => {});

    expect(DEFAULT_AGENT_ID).toBe("harness-planner");
    expect(agents.size).toBe(33);
    expect(result).toMatchObject({
      ok: true,
      payload: {
        defaultId: "harness-planner",
      },
    });
    expect(result.payload.agents).toHaveLength(33);
    expect(result.payload.agents.map((agent: { id: string }) => agent.id)).toContain("harness-security");
    expect(result.payload.agents.map((agent: { id: string }) => agent.id)).toContain("harness-release");
  });

  it("rejects_unsupported_cron_mutations", async () => {
    await expect(handleMethod("cron.add", {}, "1", () => {})).resolves.toMatchObject({
      type: "res",
      id: "1",
      ok: false,
      error: {
        code: "unsupported_method",
      },
    });

    await expect(handleMethod("cron.run", {}, "2", () => {})).resolves.toMatchObject({
      type: "res",
      id: "2",
      ok: false,
      error: {
        code: "unsupported_method",
      },
    });

    await expect(handleMethod("cron.remove", {}, "3", () => {})).resolves.toMatchObject({
      type: "res",
      id: "3",
      ok: false,
      error: {
        code: "unsupported_method",
      },
    });
  });
});

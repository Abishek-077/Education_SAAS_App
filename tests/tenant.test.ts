import { describe, expect, it } from "vitest";

import { mergeTenantWhere } from "@/lib/tenant";

describe("Tenant where clause helper", () => {
  it("injects institutionId", () => {
    expect(mergeTenantWhere(undefined, "inst_1")).toEqual({ institutionId: "inst_1" });
  });

  it("preserves existing filters", () => {
    expect(mergeTenantWhere({ status: "ACTIVE" }, "inst_2")).toEqual({
      institutionId: "inst_2",
      status: "ACTIVE",
    });
  });
});

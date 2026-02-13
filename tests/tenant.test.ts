import { describe, expect, it } from "vitest";

import { enforceTenantUniqueWhere, mergeTenantWhere } from "@/lib/tenant";

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

  it("rewrites unique lookups by id to institutionId_id composite", () => {
    expect(enforceTenantUniqueWhere({ id: "abc123" }, "inst_3")).toEqual({
      institutionId_id: {
        institutionId: "inst_3",
        id: "abc123",
      },
    });
  });

  it("keeps other unique filters tenant-scoped", () => {
    expect(enforceTenantUniqueWhere({ invoiceNo: "INV-1" }, "inst_4")).toEqual({
      institutionId: "inst_4",
      invoiceNo: "INV-1",
    });
  });
});

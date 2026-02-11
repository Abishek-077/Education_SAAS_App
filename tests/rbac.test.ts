import { Role } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { hasPermission } from "@/lib/rbac";

describe("RBAC policy", () => {
  it("grants all permissions to SUPER_ADMIN", () => {
    expect(hasPermission(Role.SUPER_ADMIN, "fees:manage")).toBe(true);
    expect(hasPermission(Role.SUPER_ADMIN, "anything:any")).toBe(true);
  });

  it("denies non-whitelisted permission for TEACHER", () => {
    expect(hasPermission(Role.TEACHER, "fees:manage")).toBe(false);
  });

  it("allows attendance manage for TEACHER", () => {
    expect(hasPermission(Role.TEACHER, "attendance:manage")).toBe(true);
  });
});

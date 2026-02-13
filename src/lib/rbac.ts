import { Role } from "@prisma/client";

export const rolePermissions = {
  [Role.SUPER_ADMIN]: ["*"],
  [Role.OWNER]: ["institution:manage", "users:manage", "students:manage", "fees:manage", "attendance:manage"],
  [Role.ADMIN]: ["students:manage", "teachers:manage", "attendance:manage", "admissions:manage"],
  [Role.TEACHER]: ["attendance:manage", "students:read"],
  [Role.ACCOUNTANT]: ["fees:manage", "students:read", "reports:read"],
  [Role.VIEWER]: ["dashboard:read", "students:read"],
  [Role.STUDENT]: ["portal:read"],
  [Role.PARENT]: ["portal:read"],
} as const;

export function hasPermission(role: Role, permission: string) {
  const permissions = rolePermissions[role] ?? [];
  return permissions.includes("*") || permissions.includes(permission);
}

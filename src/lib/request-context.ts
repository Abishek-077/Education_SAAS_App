import { headers } from "next/headers";
import { Role } from "@prisma/client";

export function getRequestContext() {
  const requestHeaders = headers();
  const institutionId = requestHeaders.get("x-institution-id");
  const userId = requestHeaders.get("x-user-id");
  const role = requestHeaders.get("x-user-role") as Role | null;

  return {
    institutionId,
    userId,
    role,
  };
}

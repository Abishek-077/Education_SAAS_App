import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      institutionId: string | null;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    institutionId: string | null;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    institutionId: string | null;
    role: Role;
  }
}

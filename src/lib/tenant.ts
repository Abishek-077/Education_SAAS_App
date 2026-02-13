import { PrismaClient, Role } from "@prisma/client";

const tenantScopedModels = [
  "student",
  "teacher",
  "class",
  "section",
  "subject",
  "admissionsLead",
  "knowledgeDocument",
  "feeStructure",
  "invoice",
  "payment",
  "attendanceSession",
  "attendanceRecord",
  "messageTemplate",
  "notification",
  "subscription",
  "auditLog",
  "analyticsEvent",
] as const;

export function mergeTenantWhere<T extends Record<string, unknown> | undefined>(where: T, institutionId: string) {
  return { institutionId, ...(where ?? {}) };
}

export function enforceTenantUniqueWhere(
  where: Record<string, unknown> | undefined,
  institutionId: string,
): Record<string, unknown> {
  if (!where) {
    return { institutionId };
  }

  const hasId = typeof where.id === "string";
  if (hasId) {
    return {
      institutionId_id: {
        institutionId,
        id: where.id,
      },
    };
  }

  return mergeTenantWhere(where, institutionId);
}

function attachInstitutionToData<T>(data: T, institutionId: string): T {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  return { ...(data as Record<string, unknown>), institutionId } as T;
}

export function withTenant(prisma: PrismaClient, institutionId: string, role: Role) {
  if (role === Role.SUPER_ADMIN) {
    return prisma;
  }

  return prisma.$extends({
    query: Object.fromEntries(
      tenantScopedModels.map((model) => [
        model,
        {
          async findMany({ args, query }: any) {
            args.where = mergeTenantWhere(args.where, institutionId);
            return query(args);
          },
          async findFirst({ args, query }: any) {
            args.where = mergeTenantWhere(args.where, institutionId);
            return query(args);
          },
          async findUnique({ args, query }: any) {
            args.where = enforceTenantUniqueWhere(args.where, institutionId);
            return query(args);
          },
          async update({ args, query }: any) {
            args.where = enforceTenantUniqueWhere(args.where, institutionId);
            return query(args);
          },
          async updateMany({ args, query }: any) {
            args.where = mergeTenantWhere(args.where, institutionId);
            return query(args);
          },
          async delete({ args, query }: any) {
            args.where = enforceTenantUniqueWhere(args.where, institutionId);
            return query(args);
          },
          async deleteMany({ args, query }: any) {
            args.where = mergeTenantWhere(args.where, institutionId);
            return query(args);
          },
          async create({ args, query }: any) {
            args.data = attachInstitutionToData(args.data, institutionId);
            return query(args);
          },
          async createMany({ args, query }: any) {
            const currentData = args.data;
            args.data = Array.isArray(currentData)
              ? currentData.map((entry) => attachInstitutionToData(entry, institutionId))
              : attachInstitutionToData(currentData, institutionId);
            return query(args);
          },
        },
      ]),
    ),
  });
}

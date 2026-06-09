import type { Tenant, CreateTenantInput, TenantUsage } from '@/types';

export class TenantService {
  static async create(input: CreateTenantInput): Promise<Tenant> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getById(id: string): Promise<Tenant | null> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getUsage(tenantId: string): Promise<TenantUsage> {
    // TODO: Implement usage aggregation
    throw new Error('Not implemented');
  }
}

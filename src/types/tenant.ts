export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  plan?: PlanTier;
  ownerId: string;
}

export interface TenantUsage {
  tenantId: string;
  totalProjects: number;
  totalTasks: number;
  totalMembers: number;
  storageUsedMB: number;
}

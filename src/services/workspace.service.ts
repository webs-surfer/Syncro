import type { Workspace, CreateWorkspaceInput, UpdateWorkspaceInput } from '@/types';

export class WorkspaceService {
  static async create(input: CreateWorkspaceInput): Promise<Workspace> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getById(id: string): Promise<Workspace | null> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getByTenantId(tenantId: string): Promise<Workspace[]> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async update(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<void> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }
}

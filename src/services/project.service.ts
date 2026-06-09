import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types';

export class ProjectService {
  static async create(input: CreateProjectInput): Promise<Project> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getById(id: string): Promise<Project | null> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getByWorkspaceId(workspaceId: string): Promise<Project[]> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async update(id: string, input: UpdateProjectInput): Promise<Project> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<void> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }
}

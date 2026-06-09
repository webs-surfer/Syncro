import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types';

export class TaskService {
  static async create(input: CreateTaskInput): Promise<Task> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getById(id: string): Promise<Task | null> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async getByProjectId(projectId: string): Promise<Task[]> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async update(id: string, input: UpdateTaskInput): Promise<Task> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<void> {
    // TODO: Implement with Prisma
    throw new Error('Not implemented');
  }

  static async reorder(taskId: string, newOrder: number): Promise<void> {
    // TODO: Implement task reordering
    throw new Error('Not implemented');
  }
}

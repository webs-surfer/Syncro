import type { TaskStatus as PrismaTaskStatus } from "@prisma/client";

export type TaskStatus = PrismaTaskStatus;
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: Date | null;
  order: number;
  projectId: string;
  createdById: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: Date | null;
  projectId: string;
  assigneeId?: string | null;
  createdById: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null;
  dueDate?: Date | null;
  order?: number;
}

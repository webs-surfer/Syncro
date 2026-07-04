import prisma from "@/lib/prisma";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";

export class TaskService {
  // ── Create ──────────────────────────────────────────────────────────────────

  /**
   * Create a new task inside a project.
   *
   * `order` is automatically set to (max existing order in that column) + 1,
   * so the new task always appears at the bottom of its kanban column.
   */
  static async create(input: CreateTaskInput): Promise<Task> {
    const status = input.status ?? "TODO";

    // Determine next order position within the column.
    const aggregate = await prisma.task.aggregate({
      where: { projectId: input.projectId, status },
      _max: { order: true },
    });
    const nextOrder = (aggregate._max.order ?? -1) + 1;

    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        status,
        dueDate: input.dueDate ?? null,
        order: nextOrder,
        projectId: input.projectId,
        createdById: input.createdById,
        assigneeId: input.assigneeId ?? null,
      },
    });
  }

  // ── Read ────────────────────────────────────────────────────────────────────

  /**
   * Fetch a single task by its ID.
   * Returns null if the task does not exist.
   */
  static async getById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  /**
   * Fetch a single task by its ID with all related data (project, assignee, creator).
   * Returns null if the task does not exist.
   */
  static async getByIdWithRelations(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        creator: true,
      },
    });
  }

  /**
   * Fetch all tasks belonging to a specific project,
   * ordered by (status ASC, order ASC) for kanban display.
   */
  static async getByProjectId(projectId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { projectId },
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });
  }

  /**
   * Fetch all tasks belonging to a specific project with related data,
   * ordered by (status ASC, order ASC) for kanban display.
   */
  static async getByProjectIdWithRelations(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      orderBy: [{ status: "asc" }, { order: "asc" }],
      include: {
        project: true,
        assignee: true,
        creator: true,
      },
    });
  }

  /**
   * Fetch all tasks that a user created or is assigned to,
   * across all projects.
   */
  static async getAllTasksByUserId(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        OR: [{ createdById: userId }, { assigneeId: userId }],
      },
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });
  }

  /**
   * Fetch all tasks that a user created or is assigned to,
   * across all projects, with related data.
   */
  static async getAllTasksByUserIdWithRelations(userId: string) {
    return prisma.task.findMany({
      where: {
        OR: [{ createdById: userId }, { assigneeId: userId }],
      },
      orderBy: [{ status: "asc" }, { order: "asc" }],
      include: {
        project: true,
        assignee: true,
        creator: true,
      },
    });
  }

  /**
   * Fetch all tasks assigned to a user across all projects.
   * Only returns tasks where the user is the assignee.
   */
  static async getTasksAssignedToUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });
  }

  /**
   * Fetch all tasks assigned to a user across all projects with related data.
   * Only returns tasks where the user is the assignee.
   */
  static async getTasksAssignedToUserWithRelations(userId: string) {
    return prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: [{ status: "asc" }, { order: "asc" }],
      include: {
        project: true,
        assignee: true,
        creator: true,
      },
    });
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  /**
   * Partially update a task (PATCH semantics).
   * Only the fields present in `input` are written; all others are untouched.
   *
   * Important: to *clear* a nullable field (e.g. remove the assignee or
   * due date), pass `null` explicitly in the `UpdateTaskInput`. Passing
   * `undefined` leaves the current database value unchanged.
   */
  static async update(id: string, input: UpdateTaskInput): Promise<Task> {
    // 1. Fetch the existing task to see if status is changing
    const existing = await prisma.task.findUnique({
      where: { id },
      select: { status: true, projectId: true },
    });

    if (!existing) {
      throw new Error(`Task with id ${id} not found`);
    }

    const data: Parameters<typeof prisma.task.update>[0]["data"] = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined)
      data.description = input.description ?? null;

    // 2. Handle Status & Order logic
    const isStatusChanging =
      input.status !== undefined && input.status !== existing.status;

    if (input.status !== undefined) {
      data.status = input.status;
    }

    if (input.order !== undefined) {
      // Explicit order provided
      data.order = input.order;
    } else if (isStatusChanging) {
      // Status changed but no order provided -> auto-append to the bottom of the new column
      const aggregate = await prisma.task.aggregate({
        where: { projectId: existing.projectId, status: input.status! },
        _max: { order: true },
      });
      data.order = (aggregate._max.order ?? -1) + 1;
    }

    if (input.assigneeId !== undefined)
      data.assigneeId = input.assigneeId ?? null;
    if (input.dueDate !== undefined) data.dueDate = input.dueDate ?? null;

    if (Object.keys(data).length === 0) {
      const fullTask = await prisma.task.findUnique({ where: { id } });
      return fullTask!;
    }

    return prisma.task.update({ where: { id }, data });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  /**
   * Hard-delete a task.
   * Throws a Prisma `P2025` error if the task does not exist.
   */
  static async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }

  // ── Reorder ─────────────────────────────────────────────────────────────────

  /**
   * Update only the `order` field of a task (used for drag-and-drop
   * reordering within a kanban column).
   */
  static async reorder(taskId: string, newOrder: number): Promise<void> {
    await prisma.task.update({
      where: { id: taskId },
      data: { order: newOrder },
    });
  }
}

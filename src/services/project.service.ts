import { prisma } from "@/lib/prisma";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/types";

export class ProjectService {
  static async create(input: CreateProjectInput): Promise<Project> {
    const inviteCode = crypto.randomUUID().slice(0, 8);
    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          name: input.name,
          description: input.description,
          inviteCode,
        },
      });
      console.log("INPUT:", input);
      console.log("OWNER ID:", input.ownerId);
      await tx.projectMember.create({
        data: {
          projectId: createdProject.id,
          userId: input.ownerId,
          role: "OWNER",
        },
      });
      return createdProject;
    });
    return project as Project;
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    const project = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
    return project;
  }
  static async update(id: string, input: UpdateProjectInput): Promise<Project> {
    // TODO: Implement with Prisma
    throw new Error("Not implemented");
  }

  static async delete(id: string): Promise<void> {
    // TODO: Implement with Prisma
    throw new Error("Not implemented");
  }
}

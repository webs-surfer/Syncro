import { prisma } from "@/lib/prisma";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/types";
import { Prisma, ProjectMember, ProjectRole } from "@prisma/client";

export class ProjectService {
  // Create a new project and assign the owner as the first member.
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

  // Get all projects where the user is a member.
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

  // Get all members of a specific project.
  static async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
    });
    return members;
  }

  // Get a project by its ID.
  static async getProjectById(id: string): Promise<Project | null> {
    return await prisma.project.findUnique({
      where: { id },
    });
  }
  // Check if a user is an admin of a project.
  static async isUserAdmin(
    projectId: string,
    userId: string,
  ): Promise<boolean> {
    const projectMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    if (!projectMembership) {
      return false;
    }
    if (projectMembership.role === "ADMIN") {
      return true;
    } else {
      return false;
    }
  }

  // Check if a user is the owner of a project.
  static async isUserOwner(
    projectId: string,
    userId: string,
  ): Promise<boolean> {
    const projectMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    if (!projectMembership) {
      return false;
    }
    if (projectMembership.role === "OWNER") {
      return true;
    } else {
      return false;
    }
  }

  // update a project by its ID.
  static async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Project not found");
    }

    const data: Prisma.ProjectUpdateInput = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.description !== undefined) {
      data.description = input.description;
    }
    data.status = input.status ?? existing.status;
    data.updatedAt = new Date();
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  // Add a member to a project with a specific role.
  static async addMember(
    projectId: string,
    userId: string,
    role: ProjectRole,
  ): Promise<ProjectMember> {
    // Check if already a member
    const existing = await ProjectService.isUserAlreadyMember(
      projectId,
      userId,
    );
    if (existing) {
      throw new Error("User is already a member of this project");
    }
    return await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
    });
  }

  // Check if a user is already a member of a project.
  static async isUserAlreadyMember(
    projectId: string,
    userId: string,
  ): Promise<boolean> {
    const existing = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    return existing ? true : false;
  }

  // Check if an invite code corresponds to a valid project.
  static async checkInviteCode(inviteCode: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: { inviteCode },
    });
    return project ? project : null;
  }

  //delete a project by its ID.
  static async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }
}

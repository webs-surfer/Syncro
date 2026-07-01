import { 
  Project as PrismaProject, 
  ProjectStatus as PrismaProjectStatus 
} from '@prisma/client';

export type ProjectStatus = PrismaProjectStatus;
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type tasksStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Project = PrismaProject;

export interface CreateProjectInput {
  name: string;
  description: string;
  status?: ProjectStatus;
  ownerId: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  updatedAt?: Date;
}

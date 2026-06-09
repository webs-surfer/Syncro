export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  workspaceId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  workspaceId: string;
  createdById: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

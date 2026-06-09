export interface Workspace {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  tenantId: string;
  createdById: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}

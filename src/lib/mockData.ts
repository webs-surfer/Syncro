export interface UserMock {
  id: string
  name: string
  initials: string
  color: string
  text: string
  isMe?: boolean
}

export const mockUsers: Record<string, UserMock> = {
  u1: { id: 'u1', name: 'John Doe', initials: 'JD', color: '#dbeafe', text: '#1d4ed8', isMe: true },
  u2: { id: 'u2', name: 'Sara Mills', initials: 'SM', color: '#dcfce7', text: '#16a34a', isMe: false },
  u3: { id: 'u3', name: 'Alex Ross', initials: 'AR', color: '#fef3c7', text: '#d97706', isMe: false },
  u4: { id: 'u4', name: 'Kate Price', initials: 'KP', color: '#fce7f3', text: '#db2777', isMe: false },
}

export interface ProjectMock {
  id: string
  name: string
  description: string
  color: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'done' | 'paused'
  lead: UserMock
  members: UserMock[]
}

export const mockProjects: Record<string, ProjectMock> = {
  'proj-1': {
    id: 'proj-1',
    name: 'CollabPM Redesign',
    description: 'Redesign the core dashboard and task management UI for v2. Focus on performance, accessibility, and a cleaner information hierarchy.',
    color: '#2563eb',
    priority: 'high',
    status: 'active',
    lead: mockUsers.u1,
    members: [mockUsers.u1, mockUsers.u2, mockUsers.u3],
  },
  'proj-2': {
    id: 'proj-2',
    name: 'API Integration',
    description: 'Connect third-party APIs to the backend service layer. Includes OAuth flows, webhook handlers, and rate-limit management.',
    color: '#16a34a',
    priority: 'medium',
    status: 'done',
    lead: mockUsers.u2,
    members: [mockUsers.u2, mockUsers.u1],
  },
  'proj-3': {
    id: 'proj-3',
    name: 'Mobile App',
    description: 'Build the React Native mobile companion app. Covers task management, push notifications, and offline sync capabilities.',
    color: '#d97706',
    priority: 'low',
    status: 'paused',
    lead: mockUsers.u3,
    members: [mockUsers.u3, mockUsers.u1, mockUsers.u4],
  },
}

export interface TaskMock {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
  project: { id: string; name: string }
  assignees: UserMock[]
  tags: { label: string; color: string }[]
}

export const mockTasks: Record<string, TaskMock> = {
  't1': {
    id: 't1',
    title: 'Set up Prisma schema',
    description: 'Define all database models in schema.prisma including User, Tenant, Workspace, Project, and Task with correct relations.',
    status: 'todo',
    priority: 'high',
    dueDate: 'Jun 12',
    createdAt: 'Jun 5, 2026',
    project: { id: 'proj-1', name: 'CollabPM Redesign' },
    assignees: [mockUsers.u3],
    tags: [{ label: 'Backend', color: 'bg-primary/10 text-primary' }],
  },
  't2': {
    id: 't2',
    title: 'Design onboarding flow',
    description: 'Design the full onboarding experience for new users including workspace creation, team invite, and first project setup.',
    status: 'todo',
    priority: 'medium',
    dueDate: 'Jun 15',
    createdAt: 'Jun 5, 2026',
    project: { id: 'proj-3', name: 'Mobile App' },
    assignees: [mockUsers.u2],
    tags: [{ label: 'Design', color: 'bg-amber-500/15 text-amber-300' }],
  },
  't3': {
    id: 't3',
    title: 'Build dashboard layout',
    description: 'Design and implement the main dashboard layout including the sidebar, header, stat cards, and quick action sections. Ensure it is responsive and accessible.',
    status: 'in_progress',
    priority: 'high',
    dueDate: 'Jun 11',
    createdAt: 'Jun 5, 2026',
    project: { id: 'proj-1', name: 'CollabPM Redesign' },
    assignees: [mockUsers.u1, mockUsers.u2],
    tags: [{ label: 'Frontend', color: 'bg-amber-500/15 text-amber-300' }],
  },
  't4': {
    id: 't4',
    title: 'Clerk auth integration',
    description: 'Integrate Clerk for authentication, establish protect/public routes middleware, and setup registration/login catch-all flows.',
    status: 'in_progress',
    priority: 'high',
    dueDate: 'Jun 14',
    createdAt: 'Jun 5, 2026',
    project: { id: 'proj-2', name: 'API Integration' },
    assignees: [mockUsers.u1],
    tags: [{ label: 'Auth', color: 'bg-primary/10 text-primary' }],
  },
  't5': {
    id: 't5',
    title: 'Initialize Next.js project',
    description: 'Set up the Next.js project with Tailwind CSS and structure components, routing, and hooks.',
    status: 'done',
    priority: 'low',
    dueDate: 'Jun 8',
    createdAt: 'Jun 1, 2026',
    project: { id: 'proj-1', name: 'CollabPM Redesign' },
    assignees: [mockUsers.u1],
    tags: [{ label: 'Core', color: 'bg-green-500/15 text-green-300' }],
  },
  't6': {
    id: 't6',
    title: 'Define TypeScript types',
    description: 'Create all TypeScript interfaces and enums in the types/ folder for User, Project, Task, Workspace, and Tenant.',
    status: 'done',
    priority: 'medium',
    dueDate: 'Jun 8',
    createdAt: 'Jun 1, 2026',
    project: { id: 'proj-1', name: 'CollabPM Redesign' },
    assignees: [mockUsers.u3],
    tags: [{ label: 'Core', color: 'bg-green-500/15 text-green-300' }],
  },
}

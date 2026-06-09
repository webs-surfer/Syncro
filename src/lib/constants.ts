export const APP_NAME = 'CollabPM';
export const APP_DESCRIPTION = 'Collaborative Project Management System';

export const TASK_STATUS_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
} as const;

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const;

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  archived: 'Archived',
  completed: 'Completed',
} as const;

export const API_BASE = '/api/v1';

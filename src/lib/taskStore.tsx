'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { mockTasks, mockProjects } from '@/lib/mockData'
import type { TaskMock } from '@/lib/mockData'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in_progress' | 'done'

/** A flattened, UI-ready task object shared across all pages */
export interface StoreTask {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
  projectId: string
  projectName: string
  tags: { label: string; color: string }[]
  assignees: {
    id: string
    name: string
    initials: string
    color: string
    text: string
    isMe?: boolean
  }[]
}

interface TaskStore {
  /** All tasks, as a flat array */
  tasks: StoreTask[]
  /** Add a new task */
  addTask: (task: Omit<StoreTask, 'id' | 'createdAt'>) => void
  /** Move a task to a new status */
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'syncro-task-store-v2'

function mockTaskToStoreTask(t: TaskMock): StoreTask {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    createdAt: t.createdAt,
    projectId: t.project.id,
    projectName: t.project.name,
    tags: t.tags,
    assignees: t.assignees.map((a) => ({
      id: a.id,
      name: a.name,
      initials: a.initials,
      color: a.color,
      text: a.text,
      isMe: a.isMe,
    })),
  }
}

/** Seed from mockData; overlay any persisted status/data from localStorage */
function buildInitialTasks(): StoreTask[] {
  const base: StoreTask[] = Object.values(mockTasks).map(mockTaskToStoreTask)

  if (typeof window === 'undefined') return base

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const stored: StoreTask[] = JSON.parse(raw)

    // Merge: keep stored tasks; re-insert any mock task not already in store
    const storedIds = new Set(stored.map((t) => t.id))
    const merged = [
      ...stored,
      ...base.filter((t) => !storedIds.has(t.id)),
    ]
    return merged
  } catch {
    return base
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const TaskStoreContext = createContext<TaskStore | null>(null)

export function TaskStoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<StoreTask[]>(buildInitialTasks)

  // Persist to localStorage on every change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = useCallback((task: Omit<StoreTask, 'id' | 'createdAt'>) => {
    const now = new Date()
    const formatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const newTask: StoreTask = {
      ...task,
      id: `t${Date.now()}`,
      createdAt: formatted,
    }
    setTasks((prev) => [newTask, ...prev])
  }, [])

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
      )
    },
    [],
  )

  const value = useMemo(
    () => ({ tasks, addTask, updateTaskStatus }),
    [tasks, addTask, updateTaskStatus],
  )

  return (
    <TaskStoreContext.Provider value={value}>
      {children}
    </TaskStoreContext.Provider>
  )
}

export function useTaskStore(): TaskStore {
  const ctx = useContext(TaskStoreContext)
  if (!ctx) throw new Error('useTaskStore must be used within <TaskStoreProvider>')
  return ctx
}

/** Returns tasks for a specific project, grouped by status */
export function useProjectTasks(projectId: string) {
  const { tasks } = useTaskStore()
  return useMemo(
    () => tasks.filter((t) => t.projectId === projectId),
    [tasks, projectId],
  )
}

/** Returns all projects from mockData (can be extended later) */
export function useProjectOptions() {
  return useMemo(
    () =>
      Object.values(mockProjects).map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
      })),
    [],
  )
}

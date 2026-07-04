'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { TaskStatus } from '@/lib/taskStore'

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskListItem = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
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

type ProjectOption = {
  id: string
  name: string
  color: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const columns: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const colAccent: Record<TaskStatus, string> = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary',
  done: 'bg-green-500/15 text-green-300',
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeTaskStatus(status?: string): TaskStatus {
  const value = (status ?? '').toUpperCase()
  if (value === 'DONE') return 'done'
  if (value === 'IN_PROGRESS' || value === 'INPROGRESS') return 'in_progress'
  return 'todo'
}

function mapApiTask(task: any, projectNameByIdOrFallback?: Map<string, string> | string, fallbackProjectName = 'Unknown project'): TaskListItem {
  const projectId = task?.projectId ?? task?.project?.id ?? ''
  const resolvedProjectName =
    typeof projectNameByIdOrFallback === 'string'
      ? projectNameByIdOrFallback
      : projectNameByIdOrFallback?.get(projectId) ?? task?.project?.name ?? fallbackProjectName

  return {
    id: task?.id ?? '',
    title: task?.title ?? 'Untitled task',
    description: task?.description ?? '',
    status: normalizeTaskStatus(task?.status),
    priority: (task?.priority ?? 'medium').toLowerCase(),
    dueDate: task?.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
    projectId,
    projectName: resolvedProjectName,
    tags:
      Array.isArray(task?.tags) && task.tags.length > 0
        ? task.tags
        : [
            {
              label: normalizeTaskStatus(task?.status) === 'done' ? 'Done' : normalizeTaskStatus(task?.status) === 'in_progress' ? 'In Progress' : 'Todo',
              color:
                normalizeTaskStatus(task?.status) === 'done'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : normalizeTaskStatus(task?.status) === 'in_progress'
                    ? 'bg-sky-500/15 text-sky-300'
                    : 'bg-muted/20 text-muted-foreground',
            },
          ],
    assignees: task?.assignee
      ? [
          {
            id: task.assignee?.id ?? '',
            name: task.assignee?.name ?? 'Unassigned',
            initials: (task.assignee?.name ?? 'Unassigned').split(/\s+/).filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase() ?? '').join('') || 'U',
            color: '#6366f1',
            text: '#ffffff',
            isMe: Boolean(task.assignee?.isMe),
          },
        ]
      : [],
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dragging, setDragging] = useState<{ task: TaskListItem; from: TaskStatus } | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  // Create form state
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false

    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken({ template: 'postman' })
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        const [projectsResponse, tasksResponse] = await Promise.all([
          fetch('/api/v1/projects', { headers, cache: 'no-store' }),
          fetch('/api/v1/tasks', { headers, cache: 'no-store' }),
        ])

        const projectsData = await projectsResponse.json().catch(() => null)
        const tasksData = await tasksResponse.json().catch(() => null)

        if (!projectsResponse.ok || !tasksResponse.ok) {
          throw new Error(projectsData?.error || tasksData?.error || 'Unable to load tasks')
        }

        if (!cancelled) {
          const nextProjects = Array.isArray(projectsData?.projects)
            ? projectsData.projects.map((project: any) => ({
                id: project?.id ?? '',
                name: project?.name ?? 'Untitled project',
                color: project?.color ?? '#6366f1',
              }))
            : []
          const projectNameById = new Map<string, string>(nextProjects.map((project: { id: string; name: string }) => [project.id, project.name]))

          setProjectOptions(nextProjects)
          setProjectId((current) => current || nextProjects[0]?.id || '')
          setTasks(Array.isArray(tasksData?.tasks) ? tasksData.tasks.map((task: any) => mapApiTask(task, projectNameById)) : [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load tasks')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [getToken, isLoaded, isSignedIn])

  // Group tasks by status
  const tasksByStatus = useMemo<Record<TaskStatus, TaskListItem[]>>(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      in_progress: tasks.filter((t) => t.status === 'in_progress'),
      done: tasks.filter((t) => t.status === 'done'),
    }),
    [tasks],
  )

  // ── Drag handlers ────────────────────────────────────────────────────────────

  function onDragStart(task: TaskListItem, from: TaskStatus) {
    setDragging({ task, from })
  }

  async function onDrop(to: TaskStatus) {
    if (!dragging || dragging.from === to) {
      setDragging(null)
      setDragOver(null)
      return
    }

    try {
      const token = await getToken({ template: 'postman' })
      const response = await fetch(`/api/v1/tasks/${dragging.task.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: to.toUpperCase() }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to update task')
      }

      setTasks((current) => current.map((task) => (task.id === dragging.task.id ? { ...task, status: to } : task)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task')
    } finally {
      setDragging(null)
      setDragOver(null)
    }
  }

  // ── Create task ──────────────────────────────────────────────────────────────

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !projectId) return

    try {
      const token = await getToken({ template: 'postman' })
      const response = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          description: '',
          projectId,
          status: status.toUpperCase(),
          dueDate: dueDate || undefined,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to create task')
      }

      const project = projectOptions.find((item) => item.id === projectId)
      setTasks((current) => [mapApiTask(data.task, project?.name ?? 'Unknown project'), ...current])

      setTitle('')
      setDueDate('')
      setStatus('todo')
      setProjectId(projectOptions[0]?.id || '')
      setShowCreate(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create task')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            My Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks assigned to you across all projects
          </p>
        </div>
        <Button
          onClick={() => setShowCreate((prev) => !prev)}
          className="text-sm font-medium rounded-lg"
        >
          {showCreate ? 'Cancel' : '+ New task'}
        </Button>
      </div>

      {/* Create task form */}
      {showCreate && (
        <section className="mb-6 rounded-[18px] border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Add a new task
          </h2>
          <form onSubmit={handleCreateTask} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-muted-foreground">
              Task title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="Task name"
              />
            </label>
            <label className="flex flex-col text-sm text-muted-foreground">
              Project
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {projectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm text-muted-foreground">
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-col text-sm text-muted-foreground">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <div className="md:col-span-2 text-right">
              <Button type="submit" className="rounded-lg">
                Create task
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Info note */}
      <p className="text-xs text-muted-foreground mb-6">
        Drag tasks between columns to update status — changes sync to the project board automatically.
      </p>

      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ key, label }) => (
          <div
            key={key}
            className={`rounded-xl p-3 transition-colors ${
              dragOver === key ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50 border border-border'
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(key)
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => onDrop(key)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colAccent[key]}`}
              >
                {tasksByStatus[key].length}
              </span>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2 min-h-20">
              {loading && tasks.length === 0 && (
                <p className="text-xs text-muted-foreground">Loading tasks…</p>
              )}
              {tasksByStatus[key].map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation()
                    onDragStart(task, key)
                  }}
                  className="block rounded-[10px] p-3 cursor-grab active:cursor-grabbing select-none hover:border-primary/30 transition-colors bg-card border border-border"
                  onClick={(e) => dragging && e.preventDefault()}
                >
                  <p className="text-sm font-medium text-foreground mb-2 leading-snug">
                    {task.title}
                  </p>

                  {/* Project name */}
                  <p className="text-[11px] text-muted-foreground mb-2 truncate">
                    📁 {task.projectName}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Due date */}
                    {task.dueDate && (
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <button
              className="w-full mt-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors text-left px-2"
              onClick={() => {
                setStatus(key)
                setShowCreate(true)
              }}
            >
              + Add task
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

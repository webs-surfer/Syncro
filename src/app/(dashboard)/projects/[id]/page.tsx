'use client'

import { useState, use, FormEvent, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { TaskStatus } from '@/lib/taskStore'

type Priority = 'high' | 'medium' | 'low'

type ProjectDetailItem = {
  id: string
  name: string
  description: string
  color: string
  priority: Priority
  status: 'active' | 'done' | 'paused'
  lead: { initials: string; name: string; color: string; text: string }
  members: { initials: string; color: string; text: string; name: string }[]
}

type ProjectTaskItem = {
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

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-500/15 text-red-300',
  medium: 'bg-amber-500/15 text-amber-300',
  low: 'bg-green-500/15 text-green-300',
}

const colAccent: Record<TaskStatus, string> = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary',
  done: 'bg-green-500/15 text-green-300',
}

const columns: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

// ── Create Task Modal ─────────────────────────────────────────────────────────

interface CreateTaskModalProps {
  projectId: string
  projectName: string
  defaultStatus: TaskStatus
  onClose: () => void
}

function CreateTaskModal({
  projectId,
  projectName,
  defaultStatus,
  onClose,
}: CreateTaskModalProps) {
  const { getToken } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)
  const [priority, setPriority] = useState<Priority>('medium')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim()) return

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
          description: description.trim(),
          projectId,
          status: status.toUpperCase(),
          dueDate: dueDate || undefined,
        }),
      })

      await response.json().catch(() => null)
      onClose()
    } catch {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className="w-full max-w-lg rounded-2xl bg-card shadow-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            New task in <span className="text-primary">{projectName}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col text-sm text-muted-foreground sm:col-span-2">
            Task title *
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="What needs to be done?"
              className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <label className="flex flex-col text-sm text-muted-foreground sm:col-span-2">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
              rows={2}
              className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none"
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

          <label className="flex flex-col text-sm text-muted-foreground">
            Priority
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-2 rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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

          <div className="sm:col-span-2 flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" className="rounded-lg text-sm">
              Create task
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const projectId = resolvedParams.id

  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [project, setProject] = useState<ProjectDetailItem>({
    id: projectId,
    name: 'Loading project…',
    description: '',
    color: '#6366f1',
    priority: 'medium',
    status: 'active',
    lead: {
      initials: 'PR',
      name: 'Project owner',
      color: '#6366f1',
      text: '#ffffff',
    },
    members: [],
  })
  const [projectTasks, setProjectTasks] = useState<ProjectTaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dragging, setDragging] = useState<{ task: ProjectTaskItem; from: TaskStatus } | null>(
    null,
  )
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  // Create-task modal state
  const [showCreate, setShowCreate] = useState(false)
  const [createStatus, setCreateStatus] = useState<TaskStatus>('todo')

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false

    async function loadProjectData() {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken({ template: 'postman' })
        const headers = {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        const [projectsResponse, tasksResponse] = await Promise.all([
          fetch('/api/v1/projects', { headers, cache: 'no-store' }),
          fetch(`/api/v1/tasks?projectId=${projectId}`, { headers, cache: 'no-store' }),
        ])

        const projectsData = await projectsResponse.json().catch(() => null)
        const tasksData = await tasksResponse.json().catch(() => null)

        if (!cancelled) {
          const matchedProject = projectsResponse.ok && projectsData?.success && Array.isArray(projectsData.projects)
            ? projectsData.projects.find((item: any) => item?.id === projectId)
            : null

          if (matchedProject) {
            const normalizedStatus = String(matchedProject.status ?? 'ACTIVE').toLowerCase()
            setProject({
              id: matchedProject.id,
              name: matchedProject.name ?? 'Untitled project',
              description: matchedProject.description ?? '',
              color: '#6366f1',
              priority: 'medium',
              status: normalizedStatus === 'completed' || normalizedStatus === 'done' ? 'done' : normalizedStatus === 'archived' || normalizedStatus === 'paused' ? 'paused' : 'active',
              lead: {
                initials: 'PR',
                name: 'Project owner',
                color: '#6366f1',
                text: '#ffffff',
              },
              members: [],
            })
          }

          if (tasksResponse.ok && tasksData?.success && Array.isArray(tasksData.tasks)) {
            setProjectTasks(tasksData.tasks.map((task: any) => ({
              id: task?.id ?? '',
              title: task?.title ?? 'Untitled task',
              description: task?.description ?? '',
              status: (task?.status ?? 'TODO').toUpperCase() === 'DONE' ? 'done' : (task?.status ?? 'TODO').toUpperCase() === 'IN_PROGRESS' ? 'in_progress' : 'todo',
              priority: (task?.priority ?? 'medium').toLowerCase(),
              dueDate: task?.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
              projectId: task?.projectId ?? projectId,
              projectName: task?.project?.name ?? projectId,
              tags: Array.isArray(task?.tags) && task.tags.length > 0 ? task.tags : [],
              assignees: Array.isArray(task?.assignees)
                ? task.assignees.map((assignee: any) => ({
                    id: assignee?.id ?? '',
                    name: assignee?.name ?? 'Unassigned',
                    initials: (assignee?.name ?? 'Unassigned').split(/\s+/).filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase() ?? '').join('') || 'U',
                    color: assignee?.color ?? '#6366f1',
                    text: assignee?.text ?? '#ffffff',
                    isMe: Boolean(assignee?.isMe),
                  }))
                : [],
            })))
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load project data')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadProjectData()

    return () => {
      cancelled = true
    }
  }, [getToken, isLoaded, isSignedIn, projectId])

  function openCreate(status: TaskStatus = 'todo') {
    setCreateStatus(status)
    setShowCreate(true)
  }

  async function onDragStart(task: ProjectTaskItem, from: TaskStatus) {
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

      setProjectTasks((current) => current.map((task) => (task.id === dragging.task.id ? { ...task, status: to } : task)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task')
    } finally {
      setDragging(null)
      setDragOver(null)
    }
  }

  // Group live tasks by status for display
  const tasksByStatus: Record<TaskStatus, ProjectTaskItem[]> = {
    todo: projectTasks.filter((t) => t.status === 'todo'),
    in_progress: projectTasks.filter((t) => t.status === 'in_progress'),
    done: projectTasks.filter((t) => t.status === 'done'),
  }

  const totalTasks = projectTasks.length
  const doneTasks = tasksByStatus.done.length

  return (
    <main key={projectId} className="flex-1 p-8">

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {/* Create Task Modal */}
      {showCreate && (
        <CreateTaskModal
          projectId={projectId}
          projectName={project.name}
          defaultStatus={createStatus}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Back button + Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/projects" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{project.name}</span>
        </div>
      </div>

      {/* Project header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg shrink-0 mt-0.5"
            style={{
              background: project.color + '20',
              border: `1.5px solid ${project.color}40`,
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center text-sm font-bold"
              style={{ color: project.color }}
            >
              {project.name[0]}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                {project.name}
              </h1>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${priorityStyles[project.priority]}`}
              >
                {project.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
        <Button onClick={() => openCreate('todo')} className="text-sm font-medium rounded-lg shrink-0">
          + New task
        </Button>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-6 px-4 py-3 rounded-xl mb-6 flex-wrap bg-muted/70 border border-border">
        {/* Lead */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Lead
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: project.lead.color, color: project.lead.text }}
            >
              {project.lead.initials}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {project.lead.name}
            </span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Members */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Team
          </span>
          <div className="flex items-center">
            {project.members.map((m, i) => (
              <div
                key={i}
                title={m.name}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white"
                style={{
                  background: m.color,
                  color: m.text,
                  marginLeft: i === 0 ? 0 : -4,
                }}
              >
                {m.initials}
              </div>
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              {project.members.length} members
            </span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Progress */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Progress
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: totalTasks ? `${(doneTasks / totalTasks) * 100}%` : '0%',
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {doneTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>
      </div>

      {loading && <p className="mb-4 text-sm text-muted-foreground">Loading project board…</p>}

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

            <div className="flex flex-col gap-2 min-h-20">
              {tasksByStatus[key].map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${projectId}/tasks/${task.id}`}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation()
                    onDragStart(task, key)
                  }}
                  onClick={(e) => dragging && e.preventDefault()}
                  className="block rounded-[10px] border border-border bg-card p-3 cursor-grab active:cursor-grabbing select-none hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground mb-2 leading-snug">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
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
                    <div className="flex items-center gap-1 shrink-0">
                      {task.dueDate && (
                        <span className="text-[10px] text-muted-foreground mr-1">
                          {task.dueDate}
                        </span>
                      )}
                      <div className="flex">
                        {task.assignees.map((a, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-background"
                            style={{
                              background: a.color,
                              color: a.text,
                              marginLeft: i === 0 ? 0 : -4,
                            }}
                          >
                            {a.initials}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Column-level add task button — pre-fills status */}
            <button
              onClick={() => openCreate(key)}
              className="w-full mt-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors text-left px-2"
            >
              + Add task
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
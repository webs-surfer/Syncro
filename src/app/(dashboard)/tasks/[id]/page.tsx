'use client'

import { useState, use, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TaskStatus } from '@/lib/taskStore'

// ── Constants ─────────────────────────────────────────────────────────────────

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-muted/70 text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary',
  done: 'bg-green-500/15 text-green-300',
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
}

function normalizeTaskStatus(status?: string): TaskStatus {
  const value = (status ?? '').toUpperCase()
  if (value === 'DONE') return 'done'
  if (value === 'IN_PROGRESS' || value === 'INPROGRESS') return 'in_progress'
  return 'todo'
}

function getProjectName(projectId: string, projectNameById: Map<string, string>, fallback = 'Unknown project') {
  return projectNameById.get(projectId) ?? fallback
}

// ── Page ──────────────────────────────────────────────────────────────────────

type TaskDetailItem = {
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

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [task, setTask] = useState<TaskDetailItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false

    async function loadTask() {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken({ template: 'postman' })
        const headers = {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        const [projectsResponse, taskResponse] = await Promise.all([
          fetch('/api/v1/projects', { headers, cache: 'no-store' }),
          fetch(`/api/v1/tasks/${resolvedParams.id}`, {
            headers,
            cache: 'no-store',
          }),
        ])

        const projectsData = await projectsResponse.json().catch(() => null)
        const data = await taskResponse.json().catch(() => null)

        if (!taskResponse.ok || !data?.success) {
          throw new Error(data?.error || 'Task not found')
        }

        if (!cancelled) {
          const apiTask = data.task
          const nextProjects: Array<{ id: string; name: string }> = Array.isArray(projectsData?.projects)
            ? projectsData.projects.map((project: any) => ({
                id: project?.id ?? '',
                name: project?.name ?? 'Untitled project',
              }))
            : []
          const projectNameById = new Map<string, string>(nextProjects.map((project) => [project.id, project.name]))
          const projectId = apiTask?.projectId ?? apiTask?.project?.id ?? ''

          setTask({
            id: apiTask?.id ?? resolvedParams.id,
            title: apiTask?.title ?? 'Untitled task',
            description: apiTask?.description ?? '',
            status: normalizeTaskStatus(apiTask?.status),
            priority: (apiTask?.priority ?? 'medium').toLowerCase(),
            dueDate: apiTask?.dueDate ? new Date(apiTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
            createdAt: apiTask?.createdAt ? new Date(apiTask.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently created',
            projectId,
            projectName: getProjectName(projectId, projectNameById, apiTask?.project?.name ?? 'Unknown project'),
            tags: Array.isArray(apiTask?.tags) && apiTask.tags.length > 0 ? apiTask.tags : [],
            assignees: Array.isArray(apiTask?.assignees)
              ? apiTask.assignees.map((assignee: any) => ({
                  id: assignee?.id ?? '',
                  name: assignee?.name ?? 'Unassigned',
                  initials: (assignee?.name ?? 'Unassigned').split(/\s+/).filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase() ?? '').join('') || 'U',
                  color: assignee?.color ?? '#6366f1',
                  text: assignee?.text ?? '#ffffff',
                  isMe: Boolean(assignee?.isMe),
                }))
              : [],
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Task not found')
          setTask(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadTask()

    return () => {
      cancelled = true
    }
  }, [getToken, isLoaded, isSignedIn, resolvedParams.id])

  if (loading) {
    return (
      <main className="flex-1 p-8">
        <p className="text-sm text-muted-foreground">Loading task…</p>
      </main>
    )
  }

  if (!task) {
    return (
      <main className="flex-1 p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50 mb-6"
        >
          ← Back
        </button>
        <p className="text-sm text-muted-foreground">{error || 'Task not found.'}</p>
      </main>
    )
  }

  async function handleStatusChange(s: TaskStatus) {
    if (!task) return

    try {
      const token = await getToken({ template: 'postman' })
      const response = await fetch(`/api/v1/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: s.toUpperCase() }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to update task')
      }

      setTask((current) => (current ? { ...current, status: s } : current))
      setShowStatusMenu(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task')
    }
  }

  return (
    <main className="flex-1 p-8 max-w-3xl">

      {/* Back button + Breadcrumb */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/tasks" className="hover:text-foreground transition-colors">
            My Tasks
          </Link>
          <span>/</span>
          <Link
            href={`/projects/${task.projectId}`}
            className="hover:text-foreground transition-colors"
          >
            {task.projectName}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{task.title}</span>
        </div>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight leading-snug">
          {task.title}
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="text-xs shrink-0 rounded-lg border border-border text-muted-foreground"
        >
          Edit task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left — main content */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* Description */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Assignees */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Assignees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {task.assignees.length === 0 && (
                  <p className="text-xs text-muted-foreground">No assignees yet.</p>
                )}
                {task.assignees.map((a, i) => (
                  <div key={a.id ?? i} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: a.color, color: a.text }}
                    >
                      {a.initials}
                    </div>
                    <span className="text-sm text-foreground font-medium">
                      {a.name}
                    </span>
                    {a.isMe && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-auto">
                        You
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right — meta */}
        <div className="flex flex-col gap-4">

          {/* Status */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${statusStyles[task.status]} cursor-pointer`}
              >
                {statusLabels[task.status]} ▾
              </button>

              {showStatusMenu && (
                <div
                  className="absolute top-10 left-0 right-0 mx-4 bg-card rounded-lg shadow-md z-10 overflow-hidden border border-border"
                >
                  {(Object.keys(statusLabels) as TaskStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors ${
                        task.status === s ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/projects/${task.projectId}`}
                className="text-sm font-medium text-primary hover:opacity-70 transition-opacity"
              >
                {task.projectName} →
              </Link>
            </CardContent>
          </Card>

          {/* Due date */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-foreground">
                {task.dueDate || '—'}
              </p>
            </CardContent>
          </Card>

          {/* Created */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{task.createdAt}</p>
            </CardContent>
          </Card>

          <Separator />

          {/* Danger */}
          <button className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors text-left">
            Delete task
          </button>

        </div>
      </div>

    </main>
  )
}
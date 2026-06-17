'use client'

import { useState, use } from 'react'
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
import { useTaskStore, type TaskStatus } from '@/lib/taskStore'

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { tasks, updateTaskStatus } = useTaskStore()

  // Support task IDs with or without the leading 't'
  const rawId = resolvedParams.id
  const task =
    tasks.find((t) => t.id === rawId) ??
    tasks.find((t) => t.id === `t${rawId}`)

  const [showStatusMenu, setShowStatusMenu] = useState(false)

  if (!task) {
    return (
      <main className="flex-1 p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50 mb-6"
        >
          ← Back
        </button>
        <p className="text-sm text-muted-foreground">Task not found.</p>
      </main>
    )
  }

  // Determine if the current user is an assignee (gate status change)
  const isAssigned = task.assignees.some((a) => a.isMe === true)

  function handleStatusChange(s: TaskStatus) {
    if (!isAssigned) return
    updateTaskStatus(task!.id, s)
    setShowStatusMenu(false)
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
              {/* Permission notice */}
              {!isAssigned && (
                <p className="text-[10px] text-amber-300 bg-amber-500/15 px-2 py-1 rounded-lg mb-2">
                  Only assignees can change status
                </p>
              )}
              <button
                onClick={() => isAssigned && setShowStatusMenu(!showStatusMenu)}
                disabled={!isAssigned}
                title={
                  isAssigned
                    ? 'Change status'
                    : 'Only assignees can change status'
                }
                className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${statusStyles[task.status]} ${
                  !isAssigned ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {statusLabels[task.status]} {isAssigned ? '▾' : '🔒'}
              </button>

              {showStatusMenu && isAssigned && (
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
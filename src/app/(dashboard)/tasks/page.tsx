'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTaskStore, useProjectOptions, type TaskStatus, type StoreTask } from '@/lib/taskStore'

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const { tasks, addTask, updateTaskStatus } = useTaskStore()
  const projectOptions = useProjectOptions()

  const [dragging, setDragging] = useState<{ task: StoreTask; from: TaskStatus } | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  // Create form state
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState(projectOptions[0]?.id || '')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')

  // Group tasks by status
  const tasksByStatus = useMemo<Record<TaskStatus, StoreTask[]>>(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      in_progress: tasks.filter((t) => t.status === 'in_progress'),
      done: tasks.filter((t) => t.status === 'done'),
    }),
    [tasks],
  )

  // ── Drag handlers ────────────────────────────────────────────────────────────

  function onDragStart(task: StoreTask, from: TaskStatus) {
    setDragging({ task, from })
  }

  function onDrop(to: TaskStatus) {
    if (!dragging || dragging.from === to) {
      setDragging(null)
      setDragOver(null)
      return
    }
    updateTaskStatus(dragging.task.id, to)
    setDragging(null)
    setDragOver(null)
  }

  // ── Create task ──────────────────────────────────────────────────────────────

  function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !projectId) return

    const project = projectOptions.find((p) => p.id === projectId)

    addTask({
      title: title.trim(),
      description: '',
      status,
      priority: 'medium',
      dueDate: dueDate || undefined,
      projectId,
      projectName: project?.name ?? 'Unknown project',
      tags: [
        {
          label:
            status === 'done'
              ? 'Done'
              : status === 'in_progress'
              ? 'In Progress'
              : 'Todo',
          color:
            status === 'done'
              ? 'bg-emerald-500/15 text-emerald-300'
              : status === 'in_progress'
              ? 'bg-sky-500/15 text-sky-300'
              : 'bg-muted/20 text-muted-foreground',
        },
      ],
      assignees: [],
    })

    // Reset form
    setTitle('')
    setDueDate('')
    setStatus('todo')
    setProjectId(projectOptions[0]?.id || '')
    setShowCreate(false)
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

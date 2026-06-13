'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockTasks } from '@/lib/mockData'

type TaskStatus = 'todo' | 'in_progress' | 'done'

// ── moved outside component ──────────────────────────────
const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-50 text-blue-600',
  done: 'bg-green-50 text-green-700',
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
}

export default function ProjectTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>
}) {
  const resolvedParams = use(params)
  const task = mockTasks[resolvedParams.taskId as keyof typeof mockTasks]

  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo')
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  if (!task) {
    return (
      <main className="flex-1 p-8">
        <p className="text-sm text-slate-500">Task not found.</p>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8 max-w-3xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
        <Link href="/projects" className="hover:text-slate-600 transition-colors">
          Projects
        </Link>
        <span>/</span>
        <Link
          href={`/projects/${task.project.id}`}
          className="hover:text-slate-600 transition-colors"
        >
          {task.project.name}
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium truncate">{task.title}</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-snug">
          {task.title}
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/tasks/${task.id}`}
            className="text-xs font-medium text-blue-600 hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg"
            style={{ background: '#eff6ff', border: '0.5px solid #bfdbfe' }}
          >
            View in My Tasks →
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-lg border-slate-200 text-slate-600"
          >
            Edit task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left — main content */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* Description */}
          <Card style={{ border: '0.5px solid #e4e4e7' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
            </CardContent>
          </Card>

          {/* Assignees */}
          <Card style={{ border: '0.5px solid #e4e4e7' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Assignees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {task.assignees.map(a => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: a.color, color: a.text }}
                      >
                        {a.initials}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{a.name}</span>
                    </div>
                    {a.isMe && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        You
                      </span>
                    )}
                  </div>
                ))}
                <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-600 transition-colors mt-1">
                  <span className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-base leading-none">
                    +
                  </span>
                  Add assignee
                </button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right — meta */}
        <div className="flex flex-col gap-4">

          {/* Status */}
          <Card style={{ border: '0.5px solid #e4e4e7' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[status]}`}
              >
                {statusLabels[status]} ▾
              </button>
              {showStatusMenu && (
                <div
                  className="absolute top-10 left-0 right-0 mx-4 bg-white rounded-lg shadow-md z-10 overflow-hidden"
                  style={{ border: '0.5px solid #e4e4e7' }}
                >
                  {(Object.keys(statusLabels) as TaskStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s); setShowStatusMenu(false) }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${
                        status === s ? 'text-blue-600' : 'text-slate-600'
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
          <Card style={{ border: '0.5px solid #e4e4e7' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/projects/${task.project.id}`}
                className="text-sm font-medium text-blue-600 hover:opacity-70 transition-opacity"
              >
                ← {task.project.name}
              </Link>
            </CardContent>
          </Card>

          {/* Due date */}
          <Card style={{ border: '0.5px solid #e4e4e7' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-slate-700">{task.dueDate}</p>
            </CardContent>
          </Card>

          {/* Created */}
          <Card style={{ border: '0.5px solid #e4e4e7' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{task.createdAt}</p>
            </CardContent>
          </Card>

          <Separator />

          <button className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors text-left">
            Delete task
          </button>

        </div>
      </div>

    </main>
  )
}
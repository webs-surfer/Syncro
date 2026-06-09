'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type TaskStatus = 'todo' | 'in_progress' | 'done'
type TagColor = 'blue' | 'amber' | 'green' | 'red' | 'purple'

interface Task {
  id: string
  title: string
  tags: { label: string; color: TagColor }[]
}

const tagStyles: Record<TagColor, string> = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
}

const initialTasks: Record<TaskStatus, Task[]> = {
  todo: [
    { id: '1', title: 'Set up Prisma schema', tags: [{ label: 'Backend', color: 'blue' }] },
    { id: '2', title: 'Design onboarding flow', tags: [{ label: 'Design', color: 'amber' }] },
    { id: '3', title: 'Write API docs', tags: [{ label: 'Docs', color: 'blue' }] },
  ],
  in_progress: [
    { id: '4', title: 'Build dashboard layout', tags: [{ label: 'Frontend', color: 'amber' }] },
    { id: '5', title: 'Clerk auth integration', tags: [{ label: 'Auth', color: 'blue' }] },
  ],
  done: [
    { id: '6', title: 'Initialize Next.js project', tags: [{ label: 'Core', color: 'green' }] },
    { id: '7', title: 'Define TypeScript types', tags: [{ label: 'Core', color: 'green' }] },
  ],
}

const columns: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const colAccent: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-500',
  in_progress: 'bg-blue-50 text-blue-600',
  done: 'bg-green-50 text-green-700',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [dragging, setDragging] = useState<{ task: Task; from: TaskStatus } | null>(null)

  function onDragStart(task: Task, from: TaskStatus) {
    setDragging({ task, from })
  }

  function onDrop(to: TaskStatus) {
    if (!dragging || dragging.from === to) return
    setTasks(prev => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter(t => t.id !== dragging.task.id),
      [to]: [...prev[to], dragging.task],
    }))
    setDragging(null)
  }

  return (
    <main className="flex-1 p-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage work across all projects</p>
        </div>
        <Button
          className="text-sm font-medium rounded-lg"
          style={{ background: '#2563eb', color: '#fff', border: 'none' }}
        >
          + New task
        </Button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl p-3"
            style={{ background: '#f4f4f6', border: '0.5px solid #e4e4e7' }}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(key)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colAccent[key]}`}>
                {tasks[key].length}
              </span>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2 min-h-[120px]">
              {tasks[key].map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => onDragStart(task, key)}
                  className="bg-white rounded-[10px] p-3 cursor-grab active:cursor-grabbing select-none"
                  style={{ border: '0.5px solid #e4e4e7' }}
                >
                  <p className="text-sm font-medium text-slate-800 mb-2 leading-snug">
                    {task.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => (
                      <span
                        key={tag.label}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagStyles[tag.color]}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add task */}
            <button
              className="w-full mt-2 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-colors text-left px-2"
            >
              + Add task
            </button>
          </div>
        ))}
      </div>

    </main>
  )
}
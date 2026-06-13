'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { mockProjects, mockTasks } from '@/lib/mockData'

type TaskStatus = 'todo' | 'in_progress' | 'done'
type Priority = 'high' | 'medium' | 'low'

interface Task {
  id: string
  title: string
  tags: { label: string; color: string }[]
  assignees: { initials: string; color: string; text: string }[]
  dueDate?: string
}

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-green-50 text-green-700',
}

const colAccent: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-500',
  in_progress: 'bg-blue-50 text-blue-600',
  done: 'bg-green-50 text-green-700',
}

const columns: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const projectId = resolvedParams.id
  
  const project = mockProjects[projectId as keyof typeof mockProjects] || mockProjects['proj-1']

  // Dynamically group tasks by status for this project
  const projectTasks = Object.values(mockTasks).filter(t => t.project.id === project.id)

  const initialTasks: Record<TaskStatus, Task[]> = {
    todo: projectTasks
      .filter(t => t.status === 'todo')
      .map(t => ({
        id: t.id,
        title: t.title,
        tags: t.tags,
        assignees: t.assignees.map(a => ({ initials: a.initials, color: a.color, text: a.text })),
        dueDate: t.dueDate,
      })),
    in_progress: projectTasks
      .filter(t => t.status === 'in_progress')
      .map(t => ({
        id: t.id,
        title: t.title,
        tags: t.tags,
        assignees: t.assignees.map(a => ({ initials: a.initials, color: a.color, text: a.text })),
        dueDate: t.dueDate,
      })),
    done: projectTasks
      .filter(t => t.status === 'done')
      .map(t => ({
        id: t.id,
        title: t.title,
        tags: t.tags,
        assignees: t.assignees.map(a => ({ initials: a.initials, color: a.color, text: a.text })),
        dueDate: t.dueDate,
      })),
  }

  const [tasks, setTasks] = useState(initialTasks)
  const [dragging, setDragging] = useState<{ task: Task; from: TaskStatus } | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  function onDragStart(task: Task, from: TaskStatus) {
    setDragging({ task, from })
  }

  function onDrop(to: TaskStatus) {
    if (!dragging || dragging.from === to) {
      setDragging(null); setDragOver(null); return
    }
    setTasks(prev => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter(t => t.id !== dragging.task.id),
      [to]: [...prev[to], dragging.task],
    }))
    setDragging(null); setDragOver(null)
  }

  const totalTasks = Object.values(tasks).flat().length
  const doneTasks = tasks.done.length

  return (
    <main key={projectId} className="flex-1 p-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/projects" className="hover:text-slate-600 transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{project.name}</span>
      </div>

      {/* Project header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg shrink-0 mt-0.5"
            style={{ background: project.color + '20', border: `1.5px solid ${project.color}40` }}
          >
            <div className="w-full h-full flex items-center justify-center text-sm font-bold"
              style={{ color: project.color }}>
              {project.name[0]}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                {project.name}
              </h1>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${priorityStyles[project.priority]}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
        <Button
          className="text-sm font-medium rounded-lg shrink-0"
          style={{ background: '#2563eb', color: '#fff', border: 'none' }}
        >
          + New task
        </Button>
      </div>

      {/* Meta row */}
      <div
        className="flex items-center gap-6 px-4 py-3 rounded-xl mb-6 flex-wrap"
        style={{ background: '#f8fafc', border: '0.5px solid #e4e4e7' }}
      >
        {/* Lead */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Lead</span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: project.lead.color, color: project.lead.text }}
            >
              {project.lead.initials}
            </div>
            <span className="text-xs font-medium text-slate-600">{project.lead.name}</span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Members */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Team</span>
          <div className="flex items-center">
            {project.members.map((m, i) => (
              <div
                key={i}
                title={m.name}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white"
                style={{ background: m.color, color: m.text, marginLeft: i === 0 ? 0 : -4 }}
              >
                {m.initials}
              </div>
            ))}
            <span className="text-xs text-slate-400 ml-2">{project.members.length} members</span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Progress */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: totalTasks ? `${(doneTasks / totalTasks) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {doneTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl p-3 transition-colors"
            style={{
              background: dragOver === key ? '#eff6ff' : '#f4f4f6',
              border: dragOver === key ? '0.5px solid #93c5fd' : '0.5px solid #e4e4e7',
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(key) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => onDrop(key)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colAccent[key]}`}>
                {tasks[key].length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-[80px]">
              {tasks[key].map(task => (
                <Link
                  key={task.id}
                  href={`/projects/${project.id}/tasks/${task.id}`}
                  draggable
                  onDragStart={e => { e.stopPropagation(); onDragStart(task, key) }}
                  onClick={e => dragging && e.preventDefault()}
                  className="block bg-white rounded-[10px] p-3 cursor-grab active:cursor-grabbing select-none hover:border-blue-200 transition-colors"
                  style={{ border: '0.5px solid #e4e4e7' }}
                >
                  <p className="text-sm font-medium text-slate-800 mb-2 leading-snug">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map(tag => (
                        <span key={tag.label} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tag.color}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {task.dueDate && (
                        <span className="text-[10px] text-slate-400 mr-1">{task.dueDate}</span>
                      )}
                      <div className="flex">
                        {task.assignees.map((a, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white"
                            style={{ background: a.color, color: a.text, marginLeft: i === 0 ? 0 : -4 }}
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

            <button className="w-full mt-2 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-colors text-left px-2">
              + Add task
            </button>
          </div>
        ))}
      </div>

    </main>
  )
}
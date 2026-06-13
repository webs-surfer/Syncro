'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { mockProjects, mockUsers } from '@/lib/mockData'

type Priority = 'high' | 'medium' | 'low'
type Status = 'active' | 'done' | 'paused'

interface Project {
  id: string
  name: string
  description: string
  color: string
  priority: Priority
  status: Status
  lead: { initials: string; name: string; color: string; text: string }
  members: { initials: string; color: string; text: string }[]
}

const initialProjects = Object.values(mockProjects)
const STORAGE_KEY = 'collabpm-projects'

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-green-50 text-green-700',
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === 'undefined') return initialProjects
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialProjects

    try {
      const parsed = JSON.parse(stored) as Project[]
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProjects
    } catch (error) {
      console.warn('Failed to parse stored projects', error)
      return initialProjects
    }
  })
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('active')

  const lead = mockUsers.u1
  const members = [mockUsers.u1, mockUsers.u2]

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return

    const nextProject: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'No description provided yet.',
      color: '#6366f1',
      priority,
      status,
      lead: {
        initials: lead.initials,
        name: lead.name,
        color: lead.color,
        text: lead.text,
      },
      members: members.map((m) => ({ initials: m.initials, color: m.color, text: m.text })),
    }

    setProjects((previous) => [nextProject, ...previous])
    setName('')
    setDescription('')
    setPriority('medium')
    setStatus('active')
    setShowCreate(false)
  }

  const recentProjects = projects.slice(0, 3)
  const projectCount = projects.length

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6 mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all your team projects</p>
        </div>
        <Button onClick={() => setShowCreate((prev) => !prev)} className="text-sm font-medium rounded-lg">
          {showCreate ? 'Cancel' : '+ New project'}
        </Button>
      </div>

      {showCreate && (
        <section className="mb-8 rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Create a new project</h2>
          <form onSubmit={handleCreateProject} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-700">
              Project name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="E.g. Marketing launch"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-700">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 min-h-30 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="Short summary of this project"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-700">
              Priority
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label className="flex flex-col text-sm text-slate-700">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as Status)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="done">Done</option>
              </select>
            </label>
            <div className="sm:col-span-2 text-right">
              <Button type="submit" className="rounded-lg">
                Create project
              </Button>
            </div>
          </form>
        </section>
      )}

      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        {projectCount > 0 ? `All projects · ${projectCount}` : 'No projects yet'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {recentProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-white rounded-[14px] flex flex-col gap-4 p-5 transition-colors hover:border-blue-200"
            style={{ border: '0.5px solid #e4e4e7' }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ background: project.color }}
                />
                <span className="text-sm font-semibold text-slate-900 leading-snug">
                  {project.name}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${priorityStyles[project.priority]}`}
              >
                {project.priority}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{project.description}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{project.members.length} members</span>
              <span>{project.status}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          className="flex flex-col items-center justify-center gap-2 min-h-50 rounded-[14px] border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-slate-400"
          onClick={() => setShowCreate(true)}
        >
          <span className="text-2xl">+</span>
          <span className="text-sm">Create a new project</span>
        </button>
      </div>
    </main>
  )
}

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

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

const projects: Project[] = [
  {
    id: '1',
    name: 'CollabPM Redesign',
    description:
      'Redesign the core dashboard and task management UI for v2. Focus on performance, accessibility, and a cleaner information hierarchy.',
    color: '#2563eb',
    priority: 'high',
    status: 'active',
    lead: { initials: 'JD', name: 'John Doe', color: '#dbeafe', text: '#1d4ed8' },
    members: [
      { initials: 'JD', color: '#dbeafe', text: '#1d4ed8' },
      { initials: 'SM', color: '#dcfce7', text: '#16a34a' },
      { initials: 'AR', color: '#fef3c7', text: '#d97706' },
    ],
  },
  {
    id: '2',
    name: 'API Integration',
    description:
      'Connect third-party APIs to the backend service layer. Includes OAuth flows, webhook handlers, and rate-limit management.',
    color: '#16a34a',
    priority: 'medium',
    status: 'done',
    lead: { initials: 'SM', name: 'Sara Mills', color: '#dcfce7', text: '#16a34a' },
    members: [
      { initials: 'SM', color: '#dcfce7', text: '#16a34a' },
      { initials: 'JD', color: '#dbeafe', text: '#1d4ed8' },
    ],
  },
  {
    id: '3',
    name: 'Mobile App',
    description:
      'Build the React Native mobile companion app. Covers task management, push notifications, and offline sync capabilities.',
    color: '#d97706',
    priority: 'low',
    status: 'paused',
    lead: { initials: 'AR', name: 'Alex Ross', color: '#fef3c7', text: '#d97706' },
    members: [
      { initials: 'AR', color: '#fef3c7', text: '#d97706' },
      { initials: 'JD', color: '#dbeafe', text: '#1d4ed8' },
      { initials: 'KP', color: '#fce7f3', text: '#db2777' },
    ],
  },
]

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-green-50 text-green-700',
}

const statusStyles: Record<Status, string> = {
  active: 'bg-blue-50 text-blue-600',
  done: 'bg-green-50 text-green-700',
  paused: 'bg-slate-100 text-slate-400 border border-slate-200',
}

export default async function ProjectsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  return (
    <main className="flex-1 p-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all your team projects</p>
        </div>
        <Button
          className="text-sm font-medium rounded-lg"
          style={{ background: '#2563eb', color: '#fff', border: 'none' }}
        >
          + New project
        </Button>
      </div>

      {/* Eyebrow */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        All projects · {projects.length}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-[14px] flex flex-col gap-4 p-5 transition-colors cursor-pointer"
            style={{ border: '0.5px solid #e4e4e7' }}
          >
            {/* Top row — name + priority */}
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

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed">{project.description}</p>

            <hr style={{ border: 'none', borderTop: '0.5px solid #f1f5f9' }} />

            {/* Project lead */}
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                style={{ background: project.lead.color, color: project.lead.text }}
              >
                {project.lead.initials}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-slate-400 font-medium">Project lead</span>
                <span className="text-xs text-slate-600 font-medium">{project.lead.name}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '0.5px solid #f1f5f9' }} />

            {/* Members + status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {project.members.map((m, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white"
                      style={{
                        background: m.color,
                        color: m.text,
                        marginLeft: i === 0 ? 0 : -6,
                      }}
                    >
                      {m.initials}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">
                  {project.members.length} members
                </span>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyles[project.status]}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          </div>
        ))}

        {/* New project card */}
        <div
          className="flex flex-col items-center justify-center gap-2 min-h-[200px] rounded-[14px] cursor-pointer transition-colors"
          style={{ border: '0.5px dashed #d1d5db', background: '#fafafa' }}
        >
          <span className="text-2xl text-slate-300">+</span>
          <span className="text-sm text-slate-400">New project</span>
        </div>
      </div>

    </main>
  )
}
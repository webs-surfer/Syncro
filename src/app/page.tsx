import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const highlightFeatures = [
  {
    icon: 'ti-layout-kanban',
    iconColor: '#7C3AED',
    title: 'Agile Workspaces',
    description: 'Scrum & Kanban boards with WIP limits built in.',
  },
  {
    icon: 'ti-brand-github',
    iconColor: '#00A3FF',
    title: 'Developer Integrations',
    description: 'Two-way sync with GitHub, GitLab, and Jira.',
  },
  {
    icon: 'ti-file-text',
    iconColor: '#22C55E',
    title: 'Collaborative Docs',
    description: 'Integrated knowledge base with inline comments.',
  },
]

const detailedFeatures = [
  {
    icon: 'ti-stack-2',
    iconColor: '#7C3AED',
    title: 'Agile Workspaces',
    description:
      'Run sprints with Scrum or Kanban boards. Set WIP limits, track velocity, and keep every sprint goal visible to the whole team.',
  },
  {
    icon: 'ti-brand-gitlab',
    iconColor: '#EC4899',
    title: 'Developer Integrations',
    description:
      'Connect GitHub and GitLab for two-way sync. Link PRs to tasks, auto-update statuses on merge, and never lose context between code and planning.',
  },
  {
    icon: 'ti-file-plus',
    iconColor: '#22C55E',
    title: 'Collaborative Docs',
    description:
      'Build a living knowledge base alongside your projects. Inline comments, version history, and shared templates keep everyone aligned.',
  },
]

const assignedIssues = [
  { title: 'Refactor auth middleware', status: 'In Progress', statusColor: '#00A3FF' },
  { title: 'Fix webhook retry logic', status: 'Blocked', statusColor: '#EF4444' },
  { title: 'Add feature flag  support', status: 'Open', statusColor: '#6B7280' },
]

const recentActivity = [
  { text: 'Merged PR #482 into main', time: '2h ago' },
  { text: 'Sprint 14 started', time: '5h ago' },
  { text: 'Evelyn commented on API spec', time: '1d ago' },
]

const milestones = [
  { title: 'API v2 launch', days: '3d left', color: '#22C55E' },
  { title: 'Security audit', days: '7d left', color: '#F59E0B' },
  { title: 'Beta rollout', days: '12d left', color: '#6B7280' },
]

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Resources: ['Docs', 'Blog', 'API Reference', 'Community'],
  Company: ['About', 'Careers', 'Privacy', 'Terms'],
}

function SyncroLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-[22px] h-[22px] text-[10px]' : 'w-[28px] h-[28px] text-xs'
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dim} rounded-lg flex items-center justify-center text-white font-bold shrink-0`}
        style={{ background: '#7C3AED' }}
      >
        <i className="ti ti-users text-[13px]" aria-hidden="true" />
      </div>
      <span className={`${textSize} font-bold tracking-tight text-black`}>Syncro</span>
    </div>
  )
}

function KanbanMockup() {
  const columns = [
    { label: 'Backlog', color: '#374151', cards: [{ color: '#7C3AED', w: 'w-[72%]' }, { color: '#00A3FF', w: 'w-[85%]' }] },
    { label: 'In Progress', color: '#1E3A5F', cards: [{ color: '#F59E0B', w: 'w-[90%]' }, { color: '#22C55E', w: 'w-[65%]' }] },
    { label: 'Review', color: '#374151', cards: [{ color: '#EC4899', w: 'w-[78%]' }] },
    { label: 'Done', color: '#374151', cards: [{ color: '#6B7280', w: 'w-[60%]' }, { color: '#7C3AED', w: 'w-[70%]' }] },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: '#0B0E14', border: '1px solid #1F2937' }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #1F2937' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[11px] text-gray-500 ml-2">Orion API — Sprint Board</span>
      </div>
      <div className="p-4 grid grid-cols-4 gap-3 min-h-[280px]">
        {columns.map((col) => (
          <div key={col.label} className="flex flex-col gap-2">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
              {col.label}
            </span>
            {col.cards.map((card, i) => (
              <div
                key={i}
                className={`${card.w} h-10 rounded-lg`}
                style={{ background: card.color, opacity: 0.85 }}
              />
            ))}
          </div>
        ))}
      </div>
      <svg className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <line x1="30%" y1="40%" x2="55%" y2="55%" stroke="#7C3AED" strokeWidth="1" strokeDasharray="4" />
        <line x1="55%" y1="55%" x2="78%" y2="45%" stroke="#00A3FF" strokeWidth="1" strokeDasharray="4" />
      </svg>
    </div>
  )
}

function DashboardPanel() {
  return (
    <div
      className="rounded-2xl p-5 h-full flex flex-col gap-5"
      style={{ background: '#0B0E14', border: '1px solid #1F2937' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
          style={{ background: '#7C3AED' }}
        >
          EP
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Evelyn Park</p>
          <p className="text-[11px] text-gray-500">Senior PM · Orion API</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          My Assigned Issues
        </p>
        <div className="flex flex-col gap-2">
          {assignedIssues.map((issue) => (
            <div
              key={issue.title}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
              style={{ background: '#111827' }}
            >
              <span className="text-[12px] text-gray-300 truncate">{issue.title}</span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded shrink-0"
                style={{ color: issue.statusColor, background: `${issue.statusColor}18` }}
              >
                {issue.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Recent Activity
        </p>
        <div className="flex flex-col gap-2.5">
          {recentActivity.map((item) => (
            <div key={item.text} className="flex items-start justify-between gap-2">
              <span className="text-[12px] text-gray-400 leading-snug">{item.text}</span>
              <span className="text-[10px] text-gray-600 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Upcoming Sprint Milestones
        </p>
        <div className="flex flex-col gap-2">
          {milestones.map((m) => (
            <div key={m.title} className="flex items-center justify-between">
              <span className="text-[12px] text-gray-300">{m.title}</span>
              <span className="text-[11px] font-medium" style={{ color: m.color }}>
                {m.days}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-end gap-1 h-16">
          {[40, 55, 45, 70, 60, 85, 75, 90, 65, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i % 3 === 0 ? '#F59E0B' : '#374151',
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <SyncroLogo />

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '/features' },
              { label: 'Billing', href: '/billing' },
              { label: 'Docs', href: '/docs' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/register"
            className="text-sm font-medium text-white px-5 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#00A3FF' }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1
              className="text-[44px] lg:text-[52px] font-bold leading-[1.08] text-black mb-5"
              style={{ letterSpacing: '-1.5px' }}
            >
              Ship Software Faster, Together.
            </h1>
            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-[480px]">
              Syncro brings agile workflows, sprint tools, and real-time synchronization
              into one workspace — so engineering teams can plan, build, and ship without
              the overhead.
            </p>
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <Link
                href="/register"
                className="text-sm font-medium text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: '#7C3AED' }}
              >
                Start Building for Free
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: '#0B0E14' }}
              >
                Request a Demo
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <i className="ti ti-circle-check text-green-500 text-base" aria-hidden="true" />
              Trusted by engineering teams at Artemis Labs, Orion Studios, and FluxApps
            </div>
          </div>

          <div className="relative">
            <KanbanMockup />
          </div>
        </div>

        {/* Small feature highlights */}
        <div className="grid sm:grid-cols-3 gap-4 mt-14">
          {highlightFeatures.map(({ icon, iconColor, title, description }) => (
            <div
              key={title}
              className="rounded-xl p-4 flex gap-3"
              style={{ background: '#0B0E14', border: '1px solid #1F2937' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-lg"
                style={{ background: `${iconColor}20`, color: iconColor }}
              >
                <i className={`ti ${icon}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features + Dashboard */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="grid sm:grid-cols-3 gap-4">
            {detailedFeatures.map(({ icon, iconColor, title, description }) => (
              <div
                key={title}
                className="rounded-xl p-5 flex flex-col"
                style={{ background: '#0B0E14', border: '1px solid #1F2937' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                  style={{ background: `${iconColor}20`, color: iconColor }}
                >
                  <i className={`ti ${icon}`} aria-hidden="true" />
                </div>
                <p className="text-sm font-bold text-white mb-2">{title}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24">
            <DashboardPanel />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0B0E14' }}>
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-[28px] h-[28px] rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ background: '#7C3AED' }}
                  >
                    <i className="ti ti-users text-xs" aria-hidden="true" />
                  </div>
                  <span className="text-base font-bold text-white">Syncro</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
                The collaborative workspace built for engineering teams who ship fast
                and stay in sync.
              </p>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <p className="text-sm font-semibold text-white mb-4">{heading}</p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: '1px solid #1F2937' }}
          >
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Syncro, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {['ti-brand-twitter', 'ti-brand-github', 'ti-brand-linkedin'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="text-gray-600 hover:text-gray-400 transition-colors"
                  aria-label={icon.replace('ti-brand-', '')}
                >
                  <i className={`ti ${icon} text-lg`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

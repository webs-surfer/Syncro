import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: 'ti-layout-kanban',
    title: 'Project management',
    description:
      'Create and organize projects. Set goals, track progress, keep your team aligned from start to finish.',
  },
  {
    icon: 'ti-checkbox',
    title: 'Task tracking',
    description:
      'Break work into tasks, assign to teammates, and move them through a simple workflow.',
  },
  {
    icon: 'ti-columns',
    title: 'Kanban board',
    description:
      'Visualize your workflow with drag-and-drop. See where every task stands at a glance.',
  },
  {
    icon: 'ti-users',
    title: 'Team workspaces',
    description:
      'Invite your team, assign roles, and collaborate in a shared workspace built for real work.',
  },
]

export default async function HomePage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f4f6' }}>

      {/* Navbar */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 h-[52px] bg-white"
        style={{ borderBottom: '0.5px solid #e4e4e7' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: '#2563eb' }}
          >
            C
          </div>
          <span className="text-sm font-medium tracking-tight text-zinc-900">
            CollabPM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="text-zinc-500 hover:text-zinc-900 text-sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild
            className="text-sm font-medium rounded-lg"
            style={{ background: '#2563eb', color: '#fff', border: 'none' }}
          >
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-[72px] pb-16 max-w-[680px] mx-auto w-full">
        <div
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-[14px] py-1 rounded-full mb-7"
          style={{
            color: '#2563eb',
            background: '#eff6ff',
            border: '0.5px solid #bfdbfe',
            letterSpacing: '0.02em',
          }}
        >
          <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: '#2563eb' }} />
          Now in beta
        </div>

        <h1
          className="text-[48px] font-semibold leading-[1.1] mb-5 text-[#0f172a]"
          style={{ letterSpacing: '-1.5px' }}
        >
          Collaborative workspace
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 50%,#60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            for modern teams
          </span>
        </h1>

        <p className="text-base leading-[1.75] mb-9 max-w-[460px] text-slate-500">
          Manage projects, track tasks, and keep your team in sync — all in one
          fast workspace built for how teams actually work.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center mb-3">
          <Button size="lg" asChild
            className="rounded-[9px] px-7 text-sm font-medium"
            style={{ background: '#2563eb', color: '#fff', border: 'none' }}
          >
            <Link href="/register">Start for free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild
            className="rounded-[9px] px-7 text-sm bg-white text-zinc-700"
            style={{ border: '0.5px solid #d1d5db' }}
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
        <p className="text-xs text-zinc-400">No credit card required.</p>
      </section>

      <div style={{ borderTop: '0.5px solid #e4e4e7' }} />

      {/* Features */}
      <section className="py-16 px-8" style={{ background: '#f4f4f6' }}>
        <p
          className="text-center text-[10px] font-semibold uppercase mb-2.5"
          style={{ letterSpacing: '0.12em', color: '#94a3b8' }}
        >
          Features
        </p>
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-semibold text-[#0f172a] mb-2" style={{ letterSpacing: '-0.5px' }}>
            Everything your team needs
          </h2>
          <p className="text-sm text-slate-500 max-w-[380px] mx-auto leading-[1.7]">
            A focused set of tools to help teams move faster without the overhead
            of complex software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[640px] mx-auto">
          {features.map(({ icon, title, description }) => (
            <Card
              key={title}
              className="bg-white rounded-[14px]"
              style={{ border: '0.5px solid #e4e4e7' }}
            >
              <CardHeader className="pb-2">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center text-[17px] mb-3"
                  style={{
                    background: '#eff6ff',
                    border: '0.5px solid #bfdbfe',
                    color: '#2563eb',
                  }}
                >
                  <i className={`ti ${icon}`} aria-hidden="true" />
                </div>
                <CardTitle className="text-sm font-semibold text-[#0f172a]">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-slate-500 leading-[1.65]">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div style={{ borderTop: '0.5px solid #e4e4e7' }} />

      {/* CTA */}
      <section className="py-16 px-6 flex justify-center" style={{ background: '#f4f4f6' }}>
        <Card
          className="w-full max-w-[480px] rounded-2xl text-center px-8 py-12 bg-white"
          style={{ border: '0.5px solid #e4e4e7' }}
        >
          <h2 className="text-[26px] font-semibold text-[#0f172a] mb-2.5" style={{ letterSpacing: '-0.5px' }}>
            Ready to get started?
          </h2>
          <p className="text-sm text-slate-500 leading-[1.7] mb-6">
            Create your workspace in seconds.
            <br />
            No setup, no complexity, no credit card.
          </p>
          <Button size="lg" asChild
            className="rounded-[9px] px-8 text-sm font-medium"
            style={{ background: '#2563eb', color: '#fff', border: 'none' }}
          >
            <Link href="/register">Create your workspace</Link>
          </Button>
        </Card>
      </section>

      <div style={{ borderTop: '0.5px solid #e4e4e7' }} />

      {/* Footer */}
      <footer className="flex items-center justify-between flex-wrap gap-3 px-8 py-5 bg-white">
        <div className="flex items-center gap-2">
          <div
            className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center text-white font-bold"
            style={{ background: '#2563eb', fontSize: '9px' }}
          >
            C
          </div>
          <span className="text-xs font-medium text-zinc-500">CollabPM</span>
        </div>
        <p className="text-[11px] text-zinc-400">
          © {new Date().getFullYear()} CollabPM. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            Register
          </Link>
        </div>
      </footer>

    </div>
  )
}
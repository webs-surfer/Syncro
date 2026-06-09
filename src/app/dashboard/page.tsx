import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const stats = [
  {
    label: 'Total Projects',
    value: '0',
    description: 'No projects yet',
    href: '/projects',
    cta: 'View projects →',
    accent: 'text-violet-600',
    border: 'border-violet-100',
  },
  {
    label: 'Open Tasks',
    value: '0',
    description: 'No tasks yet',
    href: '/tasks',
    cta: 'View tasks →',
    accent: 'text-sky-600',
    border: 'border-sky-100',
  },
]

const quickActions = [
  {
    label: 'New Project',
    description: 'Start a new project for your team',
    href: '/projects/new',
  },
  {
    label: 'New Task',
    description: 'Add a task to an existing project',
    href: '/tasks/new',
  },
]

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await currentUser()
  const firstName = user?.firstName ?? 'there'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <main className="flex-1 p-8 max-w-4xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-zinc-400 font-medium mb-1">{greeting}</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          {firstName} 👋
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Here's what's happening in your workspace today.
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Stats */}
      <section className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(({ label, value, description, href, cta, accent, border }) => (
            <Card key={label} className={`border ${border}`}>
              <CardHeader className="pb-2">
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-4xl font-bold tabular-nums">
                  {value}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{description}</span>
                <Link href={href} className={`text-xs font-medium ${accent} hover:opacity-70 transition-opacity`}>
                  {cta}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map(({ label, description, href }) => (
            <Card key={label} className="border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all duration-150">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="w-full bg-zinc-900 hover:bg-zinc-700 text-white">
                  <Link href={href}>+ {label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </main>
  )
}
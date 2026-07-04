import Link from 'next/link'

type PublicPageShellProps = {
  title: string
  description: string
  eyebrow: string
}

export function PublicPageShell({ title, description, eyebrow }: PublicPageShellProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-[28px] w-[28px] items-center justify-center rounded-lg text-white shrink-0"
              style={{ background: '#7C3AED' }}
            >
              <i className="ti ti-users text-xs" aria-hidden="true" />
            </div>
            <span className="text-base font-bold tracking-tight text-black">Syncro</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: 'Features', href: '/features' },
              { label: 'Billing', href: '/billing' },
              { label: 'Docs', href: '/docs' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/register"
            className="rounded-lg px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#00A3FF' }}
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-1 items-center px-6 py-20">
        <div className="w-full rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-violet-50/40 to-sky-50/40 p-8 shadow-sm sm:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            {eyebrow}
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            {description}
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700">
              This page is intentionally lightweight and ready for future product details, pricing information, or documentation content.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

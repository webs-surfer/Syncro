import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    color: '#6B7280',
    features: ['Up to 3 projects', '5 team members', 'Basic Kanban boards', 'Community support'],
  },
  {
    name: 'Team',
    price: '$12',
    period: '/user/mo',
    color: '#7C3AED',
    highlighted: true,
    features: [
      'Unlimited projects',
      'Unlimited members',
      'GitHub & GitLab sync',
      'Sprint analytics',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    color: '#00A3FF',
    features: [
      'SSO & SAML',
      'Advanced permissions',
      'Dedicated account manager',
      'Custom SLAs',
    ],
  },
]

function SyncroLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-[28px] h-[28px] rounded-lg flex items-center justify-center text-white font-bold shrink-0"
        style={{ background: '#7C3AED' }}
      >
        <i className="ti ti-users text-[13px]" aria-hidden="true" />
      </div>
      <span className="text-base font-bold tracking-tight text-black">Syncro</span>
    </div>
  )
}

export default function BillingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <SyncroLogo />
          </Link>
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
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: '#7C3AED' }}
        >
          Plans
        </span>
        <h1
          className="text-[40px] lg:text-[48px] font-bold leading-[1.08] text-black mt-3 mb-5"
          style={{ letterSpacing: '-1.5px' }}
        >
          Billing
        </h1>
        <p className="text-base text-gray-500 leading-relaxed max-w-[560px]">
          See how Syncro supports growing teams with simple pricing, flexible usage, and clear
          account management.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl p-6 flex flex-col"
              style={{
                background: '#0B0E14',
                border: plan.highlighted ? `1px solid ${plan.color}` : '1px solid #1F2937',
              }}
            >
              <p className="text-sm font-bold text-white mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-[12px] text-gray-500">{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <i
                      className="ti ti-circle-check text-sm shrink-0"
                      style={{ color: plan.color }}
                      aria-hidden="true"
                    />
                    <span className="text-[12px] text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-auto text-sm font-medium text-white text-center px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: plan.color }}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0B0E14' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} Syncro, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
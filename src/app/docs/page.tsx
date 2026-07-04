import Link from "next/link";

const docSections = [
  {
    icon: "ti-rocket",
    iconColor: "#7C3AED",
    title: "Getting Started",
    description:
      "Set up your first workspace, invite your team, and create your first board.",
  },
  {
    icon: "ti-api",
    iconColor: "#00A3FF",
    title: "API Reference",
    description:
      "Full reference for the Syncro REST API, webhooks, and rate limits.",
  },
  {
    icon: "ti-brand-github",
    iconColor: "#22C55E",
    title: "Integrations",
    description:
      "Connect GitHub, GitLab, and Jira with step-by-step setup guides.",
  },
  {
    icon: "ti-history",
    iconColor: "#F59E0B",
    title: "Changelog",
    description: "Track new features, fixes, and improvements as they ship.",
  },
  {
    icon: "ti-layout-kanban",
    iconColor: "#EC4899",
    title: "Workflow Guides",
    description:
      "Best practices for running Scrum and Kanban boards inside Syncro.",
  },
  {
    icon: "ti-lifebuoy",
    iconColor: "#7C3AED",
    title: "Support",
    description:
      "Troubleshooting tips and how to reach the Syncro team directly.",
  },
];

function SyncroLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-[28px] h-[28px] rounded-lg flex items-center justify-center text-white font-bold shrink-0"
        style={{ background: "#7C3AED" }}
      >
        <i className="ti ti-users text-[13px]" aria-hidden="true" />
      </div>
      <span className="text-base font-bold tracking-tight text-black">
        Syncro
      </span>
    </div>
  );
}

export default function DocsPage() {
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
              { label: "Features", href: "/features" },
              { label: "Billing", href: "/billing" },
              { label: "Docs", href: "/docs" },
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
            style={{ background: "#00A3FF" }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 w-full">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C3AED" }}
        >
          Resources
        </span>
        <h1
          className="text-[40px] lg:text-[48px] font-bold leading-[1.08] text-black mt-3 mb-5"
          style={{ letterSpacing: "-1.5px" }}
        >
          Docs
        </h1>
        <p className="text-base text-gray-500 leading-relaxed max-w-[560px]">
          Find setup guides, workflow references, and product updates that help
          your team get the most out of Syncro.
        </p>
      </section>

      {/* Docs grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docSections.map(({ icon, iconColor, title, description }) => (
            <a
              key={title}
              href="#"
              className="rounded-xl p-5 flex flex-col transition-opacity hover:opacity-90"
              style={{ background: "#0B0E14", border: "1px solid #1F2937" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ background: `${iconColor}20`, color: iconColor }}
              >
                <i className={`ti ${icon}`} aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-white mb-2">{title}</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                {description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0B0E14" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} Syncro, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

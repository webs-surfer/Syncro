'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Projects',  href: '/projects',  icon: '◫' },
  { label: 'Tasks',     href: '/tasks',      icon: '✓' },
  { label: 'Settings',  href: '/settings',   icon: '⚙' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`relative flex flex-col min-h-screen bg-[#0f0f10] border-r border-white/[0.06] py-5 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[60px] px-2' : 'w-64 px-3'
      }`}
    >
      {/* Logo + hamburger row */}
      <div className={`flex items-center mb-8 px-1 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">
              C
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              CollabPM
            </span>
          </div>
        )}

        {/* Hamburger button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex flex-col justify-center items-center w-8 h-8 rounded-lg hover:bg-white/[0.06] transition-colors shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            /* three lines → open */
            <span className="flex flex-col gap-[5px]">
              <span className="block w-4 h-[1.5px] bg-white/40 rounded-full" />
              <span className="block w-4 h-[1.5px] bg-white/40 rounded-full" />
              <span className="block w-4 h-[1.5px] bg-white/40 rounded-full" />
            </span>
          ) : (
            /* X → close */
            <span className="relative w-4 h-4">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="block w-4 h-[1.5px] bg-white/40 rounded-full rotate-45 absolute" />
                <span className="block w-4 h-[1.5px] bg-white/40 rounded-full -rotate-45 absolute" />
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Nav label */}
      {!collapsed && (
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Menu
        </p>
      )}

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ label, href, icon }) => {
          // Active if pathname is exactly href, or if it is a subpage of href
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 group
                ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-blue-600/15 text-blue-300'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
            >
              <span
                className={`shrink-0 text-base leading-none ${
                  isActive ? 'text-blue-400' : 'text-white/30 group-hover:text-white/60'
                }`}
              >
                {icon}
              </span>
              {!collapsed && label}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <Separator className="my-4 bg-white/[0.06]" />

      {/* Bottom — user profile */}
      <div className={`${collapsed ? 'flex justify-center' : 'px-3'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <UserButton
            appearance={{
              elements: { avatarBox: 'w-8 h-8' },
            }}
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white/70 text-xs font-medium truncate">My Account</span>
              <span className="text-white/30 text-[11px] truncate">Manage profile</span>
            </div>
          )}
        </div>
      </div>

    </aside>
  )
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type Section = 'profile' | 'appearance' | 'account'

const navItems: { key: Section; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'account', label: 'Account' },
]

export default function SettingsPage() {
  const [active, setActive] = useState<Section>('profile')
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  return (
    <main className="flex-1 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6 max-w-3xl">

        {/* Side nav */}
        <nav className="flex flex-col gap-1 w-44 shrink-0">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                active === key
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div
          className="flex-1 bg-white rounded-xl p-6"
          style={{ border: '0.5px solid #e4e4e7' }}
        >

          {/* PROFILE */}
          {active === 'profile' && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Profile information</h2>
              <p className="text-xs text-slate-500 mb-5">Update your name and email address</p>

              <div className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-3 py-2 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-400"
                      style={{ border: '0.5px solid #d1d5db' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-3 py-2 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-400"
                      style={{ border: '0.5px solid #d1d5db' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-400"
                    style={{ border: '0.5px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue="johndoe"
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-400"
                    style={{ border: '0.5px solid #d1d5db' }}
                  />
                </div>
              </div>

              <Button
                className="text-sm font-medium rounded-lg"
                style={{ background: '#2563eb', color: '#fff', border: 'none' }}
              >
                Save changes
              </Button>
            </div>
          )}

          {/* APPEARANCE */}
          {active === 'appearance' && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Appearance</h2>
              <p className="text-xs text-slate-500 mb-5">Customize how CollabPM looks for you</p>

              <div className="flex flex-col gap-1">
                {/* Dark mode toggle */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Dark mode</p>
                    <p className="text-xs text-slate-400 mt-0.5">Switch to a darker color scheme</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-10 h-[22px] rounded-full relative transition-colors duration-200 shrink-0"
                    style={{ background: darkMode ? '#2563eb' : '#d1d5db' }}
                  >
                    <span
                      className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm"
                      style={{ left: darkMode ? '22px' : '3px' }}
                    />
                  </button>
                </div>

                <Separator />

                {/* Compact mode toggle */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Compact mode</p>
                    <p className="text-xs text-slate-400 mt-0.5">Reduce spacing for a denser layout</p>
                  </div>
                  <button
                    onClick={() => setCompactMode(!compactMode)}
                    className="w-10 h-[22px] rounded-full relative transition-colors duration-200 shrink-0"
                    style={{ background: compactMode ? '#2563eb' : '#d1d5db' }}
                  >
                    <span
                      className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm"
                      style={{ left: compactMode ? '22px' : '3px' }}
                    />
                  </button>
                </div>

                <Separator />

                {/* Theme color */}
                <div className="py-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">Accent color</p>
                  <p className="text-xs text-slate-400 mb-3">Choose your preferred accent color</p>
                  <div className="flex gap-2">
                    {[
                      { color: '#2563eb', label: 'Blue' },
                      { color: '#7c3aed', label: 'Violet' },
                      { color: '#16a34a', label: 'Green' },
                      { color: '#d97706', label: 'Amber' },
                      { color: '#dc2626', label: 'Red' },
                    ].map(({ color, label }) => (
                      <button
                        key={color}
                        title={label}
                        className="w-7 h-7 rounded-full ring-offset-2 ring-2 transition-all"
                        style={{
                          background: color,
                          ringColor: color === '#2563eb' ? color : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {active === 'account' && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Account</h2>
              <p className="text-xs text-slate-500 mb-5">Manage your account settings</p>

              {/* Change password */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                  Security
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Current password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400"
                      style={{ border: '0.5px solid #d1d5db' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400"
                      style={{ border: '0.5px solid #d1d5db' }}
                    />
                  </div>
                </div>
                <Button
                  className="mt-4 text-sm font-medium rounded-lg"
                  style={{ background: '#2563eb', color: '#fff', border: 'none' }}
                >
                  Update password
                </Button>
              </div>

              <Separator />

              {/* Danger zone */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-4">
                  Danger zone
                </p>
                <div
                  className="rounded-xl p-4"
                  style={{ background: '#fff5f5', border: '0.5px solid #fecaca' }}
                >
                  <p className="text-sm font-semibold text-red-700 mb-1">Delete account</p>
                  <p className="text-xs text-red-400 mb-4 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '0.5px solid #fecaca',
                    }}
                  >
                    Delete my account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
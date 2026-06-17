'use client'

import { useEffect, useState } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTheme } from '@/components/ThemeInitializer'

type Section = 'profile' | 'appearance' | 'account'

const navItems: { key: Section; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'account', label: 'Account' },
]

const accentOptions = [
  { color: '#2563eb', label: 'Blue' },
  { color: '#7c3aed', label: 'Violet' },
  { color: '#16a34a', label: 'Green' },
  { color: '#d97706', label: 'Amber' },
  { color: '#dc2626', label: 'Red' },
]

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const {
    darkMode,
    compactMode,
    selectedAccent,
    setDarkMode,
    setCompactMode,
    setSelectedAccent,
  } = useTheme()
  const [active, setActive] = useState<Section>('profile')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [profileStatus, setProfileStatus] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [accountStatus, setAccountStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return

    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
    setUsername(user?.username ?? '')

    const emailAddress =
      (user as any)?.primaryEmailAddress?.emailAddress ||
      (user as any)?.emailAddresses?.[0]?.emailAddress ||
      ''

    setEmail(emailAddress)
  }, [isLoaded, user])

  const getPrimaryEmailAddressId = () => {
    return (user as any)?.primaryEmailAddress?.id || (user as any)?.primaryEmailAddressId
  }

  const handleSaveProfile = async () => {
    setProfileStatus(null)
    if (!user) {
      setProfileStatus('User not loaded yet.')
      return
    }

    try {
      const updatePayload: any = {
        firstName,
        lastName,
        username,
      }

      const primaryEmailId = getPrimaryEmailAddressId()
      if (email && primaryEmailId) {
        updatePayload.emailAddresses = [
          {
            id: primaryEmailId,
            emailAddress: email,
          },
        ]
      }

      if (typeof (user as any).update === 'function') {
        await (user as any).update(updatePayload)
        setProfileStatus('Profile updated successfully.')
      } else {
        setProfileStatus('Profile saved locally; Clerk update method not available.')
      }
    } catch (error) {
      console.error(error)
      setProfileStatus('Unable to update profile. Please try again.')
    }
  }

  const handleUpdatePassword = async () => {
    setAccountStatus(null)

    if (!currentPassword || !newPassword) {
      setAccountStatus('Please enter both current and new password.')
      return
    }

    if (!user) {
      setAccountStatus('User not loaded yet.')
      return
    }

    try {
      if (typeof (user as any).updatePassword === 'function') {
        await (user as any).updatePassword({
          currentPassword,
          newPassword,
        })
        setAccountStatus('Password updated successfully.')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        setAccountStatus('Password update is not supported in this environment.')
      }
    } catch (error) {
      console.error(error)
      setAccountStatus('Unable to update password. Please verify your current password.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This will sign you out. Account deletion requires backend support. Continue?'
    )
    if (!confirmed) return

    try {
      if (typeof signOut === 'function') {
        await signOut()
        setAccountStatus('Signed out. Delete account requires backend support.')
      } else {
        setAccountStatus('Unable to sign out. Delete account not available.')
      }
    } catch (error) {
      console.error(error)
      setAccountStatus('Unable to complete account deletion action.')
    }
  }

  return (
    <main className="flex-1 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
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
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="flex-1 rounded-xl border border-border bg-card p-6">

          {/* PROFILE */}
          {active === 'profile' && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-1">Profile information</h2>
              <p className="text-xs text-muted-foreground mb-5">Update your name and email address</p>

              <div className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {profileStatus && <p className="text-sm text-muted-foreground mb-4">{profileStatus}</p>}

              <Button
                type="button"
                className="text-sm font-medium rounded-lg"
                style={{ background: '#2563eb', color: '#fff', border: 'none' }}
                onClick={handleSaveProfile}
              >
                Save changes
              </Button>
            </div>
          )}

          {/* APPEARANCE */}
          {active === 'appearance' && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-1">Appearance</h2>
              <p className="text-xs text-muted-foreground mb-5">Customize how CollabPM looks for you</p>

              <div className="flex flex-col gap-1">
                {/* Dark mode toggle */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Switch to a darker color scheme</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-10 h-5.5 rounded-full relative transition-colors duration-200 shrink-0 ${darkMode ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span
                      className={`absolute top-0.75 w-4 h-4 rounded-full bg-card transition-all duration-200 shadow-sm ${darkMode ? 'left-[22px]' : 'left-[3px]'}`}
                    />
                  </button>
                </div>

                <Separator />

                {/* Compact mode toggle */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Compact mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Reduce spacing for a denser layout</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompactMode(!compactMode)}
                    className={`w-10 h-5.5 rounded-full relative transition-colors duration-200 shrink-0 ${compactMode ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span
                      className={`absolute top-0.75 w-4 h-4 rounded-full bg-card transition-all duration-200 shadow-sm ${compactMode ? 'left-[22px]' : 'left-[3px]'}`}
                    />
                  </button>
                </div>

                <Separator />

                {/* Theme color */}
                <div className="py-3">
                  <p className="text-sm font-medium text-foreground mb-1">Accent color</p>
                  <p className="text-xs text-muted-foreground mb-3">Choose your preferred accent color</p>
                  <div className="flex gap-2 mb-4">
                    {accentOptions.map(({ color, label }) => (
                      <button
                        key={color}
                        type="button"
                        title={label}
                        onClick={() => setSelectedAccent(color)}
                        className={`w-7 h-7 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                          selectedAccent === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                        style={{
                          background: color,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="rounded-3xl p-4 text-sm font-medium text-white"
                    style={{ background: selectedAccent }}
                  >
                    Accent preview
                    <p className="text-xs opacity-90 mt-1 text-white/80">Your selected accent is applied globally.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {active === 'account' && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-1">Account</h2>
              <p className="text-xs text-muted-foreground mb-5">Manage your account settings</p>

              {/* Change password */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-4">
                  Security
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Current password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      New password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

{accountStatus && <p className="text-sm text-muted-foreground mt-4">{accountStatus}</p>}

                <Button
                  type="button"
                  className="mt-4 text-sm font-medium rounded-lg"
                  style={{ background: '#2563eb', color: '#fff', border: 'none' }}
                  onClick={handleUpdatePassword}
                >
                  Update password
                </Button>
              </div>

              <Separator />

              {/* Danger zone */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-destructive/70 mb-4">
                  Danger zone
                </p>
                <div className="rounded-xl p-4 bg-destructive/10 border border-destructive/30">
                  <p className="text-sm font-semibold text-destructive mb-1">Delete account</p>
                  <p className="text-xs text-destructive/80 mb-4 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/40 transition-colors hover:bg-destructive/30"
                    onClick={handleDeleteAccount}
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
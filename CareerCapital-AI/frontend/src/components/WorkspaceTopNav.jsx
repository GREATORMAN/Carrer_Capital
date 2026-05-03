import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, BrainCircuit, FileText } from 'lucide-react'
import { useAuthStore } from '../store'
import { userService } from '../services/api'
import { getProfileStrength, getCurrentStage } from '../utils/workspace'

export default function WorkspaceTopNav() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const currentStage = getCurrentStage(location.pathname)

  const [profileCenter, setProfileCenter] = useState({ profile: null, documents: [] })

  useEffect(() => {
    let mounted = true
    userService.getProfileCenter()
      .then((res) => {
        if (mounted) {
          setProfileCenter({ profile: res.data.profile, documents: res.data.documents || [] })
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const profileStrength = getProfileStrength(profileCenter.profile, profileCenter.documents)

  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 sm:px-6 lg:px-8">
      {/* Left side: Page Title & Subtitle */}
      <div className="flex items-center gap-4">
        {/* Mobile menu spacer, sidebar handles the menu button itself via fixed position usually, but we keep this clean */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold tracking-tight text-[#0a2540] dark:text-white">
            {currentStage.label}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentStage.detail}
          </p>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Profile Completion Indicator */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Profile: <span className="text-[#0a2540] dark:text-white">{profileStrength}% complete</span>
          </span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-500"
              style={{ width: `${profileStrength}%` }}
            />
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/alerts"
            title="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </Link>

          <Link
            to="/ai-engine"
            className="hidden items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#635bff,#00d4ff)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md sm:flex"
          >
            <BrainCircuit className="h-4 w-4" />
            Get AI Recommendation
          </Link>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* User Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {userInitials}
        </div>
      </div>
    </header>
  )
}

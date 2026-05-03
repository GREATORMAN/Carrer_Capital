import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plane,
  Search,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  WalletCards,
} from 'lucide-react'
import { useAuthStore, useThemeStore } from '../store'
import { userService } from '../services/api'
import { getCurrentStage, getProfileGaps, getProfileStrength, journeyStages } from '../utils/workspace'

const stageIcons = {
  '01': Target,       // Career Discovery
  '02': FileText,     // Admission Planning
  '03': Sparkles,     // Profile Enhancement
  '04': Trophy,       // Cost & ROI Planning
  '05': Landmark,     // Loan Intelligence
  '06': WalletCards,  // Smart Repayment
  '07': Plane,        // Visa & Risk
  '08': GraduationCap,// Mentorship
  '09': Briefcase,    // Smart Living
  '10': Search,       // Progress Tracking
}

export default function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileCenter, setProfileCenter] = useState({ profile: null, documents: [] })

  useEffect(() => {
    let mounted = true
    userService.getProfileCenter()
      .then((profileResponse) => {
        if (mounted) {
          setProfileCenter({ profile: profileResponse.data.profile, documents: profileResponse.data.documents || [] })
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const currentStage = useMemo(() => getCurrentStage(location.pathname), [location.pathname])
  const profileStrength = getProfileStrength(profileCenter.profile, profileCenter.documents)
  const nextGaps = getProfileGaps(profileCenter.profile, profileCenter.documents)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarBody = (
    <div
      className={`flex h-full flex-col border-r border-slate-200/70 bg-[linear-gradient(180deg,rgba(247,250,255,0.92),rgba(240,246,255,0.88))] text-slate-900 shadow-[18px_0_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition-[width] duration-300 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,23,42,0.96),rgba(10,18,32,0.96))] dark:text-slate-100 ${
        collapsed ? 'w-[92px]' : 'w-[300px]'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-4 dark:border-white/8">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
          <LogoBadge />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-[#0a2540] dark:text-white">CareerCapital AI</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Decision and execution workspace</p>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 lg:block dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`mb-4 flex items-center rounded-2xl border transition ${
            collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3.5'
          } ${
            location.pathname === '/dashboard'
              ? 'border-teal-400/30 bg-[linear-gradient(135deg,rgba(17,128,125,0.18),rgba(13,148,136,0.1))] text-[#0a2540] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.18)] dark:text-white'
              : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-teal-300/40 hover:bg-white dark:border-white/8 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/7'
          }`}
          title={collapsed ? 'Dashboard' : undefined}
        >
          <div className="rounded-xl bg-teal-500/12 p-2 text-teal-600 dark:bg-white/8 dark:text-[#53d7ff]">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Dashboard</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Current stage, progress, and next actions</p>
            </div>
          )}
        </Link>

        <div className="mb-4 space-y-2">
          <SidebarFeatureLink
            collapsed={collapsed}
            href="/ai-assistant"
            icon={Sparkles}
            label="AI Assistant"
            active={location.pathname === '/ai-assistant'}
            onClick={() => setMobileOpen(false)}
          />
          <SidebarFeatureLink
            collapsed={collapsed}
            href="/ai-engine"
            icon={BrainCircuit}
            label="AI Decision Engine"
            active={location.pathname === '/ai-engine'}
            onClick={() => setMobileOpen(false)}
            badge="NEW"
          />
        </div>

        {!collapsed && (
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Tools</p>
        )}
        <div className="mb-4 space-y-2">
          <SidebarFeatureLink
            collapsed={collapsed}
            href="/alerts"
            icon={Bell}
            label="Alerts & Reminders"
            active={location.pathname === '/alerts'}
            onClick={() => setMobileOpen(false)}
            badge="2"
          />
        </div>

        {!collapsed && (
          <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/8 dark:bg-white/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current stage</p>
                <p className="mt-2 text-sm font-semibold text-[#0a2540] dark:text-white">
                  Stage {currentStage.number} - {currentStage.label}
                </p>
              </div>
              <span className="rounded-full bg-teal-500/12 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-white/8 dark:text-[#7ce7ff]">
                {profileStrength}%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-400" style={{ width: `${profileStrength}%` }} />
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              {nextGaps.length ? `${nextGaps.length} gap${nextGaps.length > 1 ? 's' : ''} remaining.` : 'Profile is decision-ready.'}
            </p>
          </div>
        )}

        {!collapsed && (
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Journey stages</p>
        )}

        <nav className="space-y-1">
          {journeyStages.map((item) => {
            const Icon = stageIcons[item.number]
            const active = location.pathname === item.href
            const isPast = parseInt(item.number, 10) < parseInt(currentStage.number, 10)
            const isCurrent = parseInt(item.number, 10) === parseInt(currentStage.number, 10)
            return (
              <Link
                key={`${item.number}-${item.label}`}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative rounded-2xl border transition ${
                  collapsed ? 'flex justify-center px-2 py-3.5' : 'block px-3 py-3.5'
                } ${
                  active
                    ? 'border-teal-400/30 bg-[linear-gradient(135deg,rgba(17,128,125,0.18),rgba(13,148,136,0.1))] text-[#0a2540] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.16)] dark:border-teal-300/20 dark:bg-[linear-gradient(135deg,rgba(15,118,110,0.42),rgba(255,255,255,0.04))] dark:text-white'
                    : 'border-transparent text-slate-700 hover:border-slate-200/90 hover:bg-white/70 hover:text-[#0a2540] dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {active && <span className="absolute inset-y-3 right-0 w-[3px] rounded-full bg-teal-500" />}
                {collapsed ? (
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-teal-700 dark:text-[#7ce7ff]' : 'text-slate-500 group-hover:text-teal-700 dark:text-slate-400 dark:group-hover:text-slate-200'}`} />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      isCurrent
                        ? 'border-teal-500/45 bg-teal-500/15 text-teal-700 dark:border-teal-300/35 dark:bg-white/8 dark:text-[#7ce7ff]'
                        : isPast
                        ? 'border-teal-500/40 bg-teal-500/10 text-teal-600 dark:border-teal-400/30 dark:bg-teal-500/10 dark:text-teal-400'
                        : 'border-slate-300/80 bg-white text-slate-600 dark:border-white/12 dark:bg-white/6 dark:text-slate-300'
                    }`}>
                      {isPast ? <CheckCircle2 className="h-5 w-5" /> : item.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-teal-700 dark:text-[#7ce7ff]' : 'text-slate-500 dark:text-slate-400'}`} />
                        <p className="truncate text-sm font-semibold">{item.label}</p>
                        {isCurrent && <Star className="h-3.5 w-3.5 animate-pulse fill-teal-500 text-teal-500" />}
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200/70 p-3 dark:border-white/8">
        {!collapsed && user && (
          <div className="mb-3 rounded-xl bg-white/70 px-3 py-2.5 shadow-sm dark:bg-white/5">
            <p className="truncate text-sm font-medium text-[#0a2540] dark:text-white">{user.name || 'Student'}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-white/70 hover:text-[#0a2540] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
            title={collapsed ? 'Toggle theme' : undefined}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-white/70 hover:text-[#0a2540] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
            title={collapsed ? 'Sign out' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
        {!collapsed && (
          <div className="mt-4 text-center">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">TEAM 🚀 | Vishalsai BJ & D Varshini</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-slate-200/70 bg-white/90 p-3 text-slate-800 shadow-lg backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/90 dark:text-white"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="hidden lg:block">{sidebarBody}</aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
              aria-label="Close navigation"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <div className="h-full w-[300px]">{sidebarBody}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarFeatureLink({ collapsed, href, icon: Icon, label, active, onClick, badge }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`group relative flex items-center rounded-2xl border transition ${
        collapsed ? 'justify-center px-2 py-3.5' : 'gap-3 px-3 py-3.5'
      } ${
        active
          ? 'border-teal-400/30 bg-[linear-gradient(135deg,rgba(17,128,125,0.18),rgba(13,148,136,0.1))] text-[#0a2540] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.16)] dark:border-teal-300/20 dark:bg-[linear-gradient(135deg,rgba(15,118,110,0.42),rgba(255,255,255,0.04))] dark:text-white'
          : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-teal-300/40 hover:bg-white dark:border-white/8 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/7 dark:hover:text-white'
      }`}
      title={collapsed ? label : undefined}
    >
      {active && <span className="absolute inset-y-3 right-0 w-[3px] rounded-full bg-teal-500" />}
      <div className={`rounded-xl p-2 ${active ? 'bg-teal-500/15 text-teal-700 dark:bg-white/8 dark:text-[#7ce7ff]' : 'bg-slate-100 text-slate-600 dark:bg-white/6 dark:text-slate-300'}`}>
        <Icon className="h-4 w-4" />
      </div>
      {!collapsed && (
        <div className="flex min-w-0 flex-1 items-center justify-between pr-1">
          <p className="truncate text-sm font-semibold">{label}</p>
          {badge && (
            <span className="ml-2 flex-shrink-0 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              {badge}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

function LogoBadge() {
  return (
    <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(125,211,252,0.9),rgba(14,165,233,0.85)_35%,rgba(12,34,67,0.95)_100%)] shadow-[0_10px_24px_rgba(14,165,233,0.18)] ring-1 ring-sky-500/20">
      <span className="absolute inset-[7px] rounded-full border-[3px] border-slate-100/90" />
      <span className="absolute left-[7px] top-[10px] h-[19px] w-[19px] rounded-full border-[3px] border-slate-100/90 border-r-transparent border-b-transparent rotate-[-18deg]" />
      <span className="absolute right-[6px] top-[17px] h-[15px] w-[15px] rounded-full border-[3px] border-slate-100/90 border-l-transparent border-t-transparent" />
      <span className="relative text-[10px] font-bold tracking-[0.18em] text-white">CC</span>
    </div>
  )
}

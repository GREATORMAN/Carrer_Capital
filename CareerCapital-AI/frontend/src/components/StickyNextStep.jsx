import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { userService } from '../services/api'
import { getProfileGaps } from '../utils/workspace'

export default function StickyNextStep() {
  const location = useLocation()
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

  const profileGaps = getProfileGaps(profileCenter.profile, profileCenter.documents)

  // Dynamic logic based on profile gaps and current route
  let actionText = "Explore colleges that match your goal profile"
  let ctaText = "Go to College Finder"
  let ctaLink = "/college-finder"

  if (profileGaps.length > 0) {
    actionText = `Complete your profile: ${profileGaps[0]}`
    ctaText = "Fix Now"
    ctaLink = "/profile-enhancer"
  } else if (location.pathname === '/college-finder') {
    actionText = "Shortlist your top 3 colleges to proceed"
    ctaText = "View Saved Colleges"
    ctaLink = "/dashboard"
  } else if (location.pathname === '/scholarships') {
    actionText = "Apply for your highest-match scholarship"
    ctaText = "Start Application"
    ctaLink = "/scholarships"
  }

  // Do not show on non-stage pages or dashboard if we strictly want it only on "stage pages".
  if (location.pathname === '/career-discovery') {
    return null; // Stage 01 handles its own sticky footer for the wizard
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md lg:left-[300px] dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="font-bold text-[#0a2540] dark:text-white">Your next best action: </span>
            {actionText}
          </p>
        </div>
        <Link
          to={ctaLink}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0a2540] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#173b5c] sm:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {ctaText} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

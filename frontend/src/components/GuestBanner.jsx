import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { X, UserCircle } from 'lucide-react'
import { useState } from 'react'

export default function GuestBanner() {
  const { isGuest } = useAuthStore()
  const [dismissed, setDismissed] = useState(false)

  if (!isGuest || dismissed) return null

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-white shadow-md lg:left-[300px]">
      <div className="flex items-center gap-2 text-sm font-medium">
        <UserCircle className="h-4 w-4 flex-shrink-0" />
        <span>You're in <strong>Guest Mode</strong> — your data is saved locally in this browser only.</span>
        <Link
          to="/signup"
          className="ml-2 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold hover:bg-white/30 transition-all"
        >
          Create free account to save permanently →
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 rounded-lg p-1 hover:bg-white/20 transition-all"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

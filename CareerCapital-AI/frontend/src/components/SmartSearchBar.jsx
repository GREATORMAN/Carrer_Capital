import React, { useState } from 'react'
import { Search, Sparkles, X } from 'lucide-react'
import { Button } from './index'

export default function SmartSearchBar({ value, onChange, onSubmit, compact = false }) {
  const [focused, setFocused] = useState(false)
  const suggestions = [
    'Best MS under Rs 25L with high salary',
    'Canada data science with scholarships',
    'No GRE public universities for CS',
  ]

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.(value)
        }}
        className={`group flex items-center gap-3 rounded-full border border-white/70 bg-white/85 p-2 shadow-[0_18px_60px_rgba(10,37,64,0.12)] backdrop-blur-2xl focus-within:ring-4 focus-within:ring-[#635bff]/10 dark:border-white/10 dark:bg-slate-950/80 ${compact ? 'max-w-2xl' : 'w-full'}`}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#635bff]/10 text-[#635bff]">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search colleges, courses, countries, or ask: Best MS under Rs 25L"
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
        {value && (
          <button type="button" onClick={() => onChange('')} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        )}
        <Button type="submit" size="sm" className="hidden gap-2 sm:inline-flex">
          <Sparkles className="h-4 w-4" />
          Search
        </Button>
      </form>

      {focused && !value && !compact && (
        <div onMouseLeave={() => setFocused(false)} className="absolute left-0 right-0 top-full z-20 mt-3 rounded-2xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Smart searches</p>
          {suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => { onChange(suggestion); onSubmit?.(suggestion); setFocused(false) }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900">
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

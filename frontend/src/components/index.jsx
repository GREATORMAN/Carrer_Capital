import React from 'react'
import { motion } from 'framer-motion'

export function PageHeader({ eyebrow, title, description, actions = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 flex flex-col justify-between gap-5 border-b border-slate-200/70 pb-7 dark:border-slate-800/80 lg:flex-row lg:items-end"
    >
      <div>
        {eyebrow && <p className="section-kicker mb-3">{eyebrow}</p>}
        <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </motion.div>
  )
}

export function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.01, transition: { duration: 0.22 } } : {}}
      className={`glass dark:glass-dark card-hover-lift rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClass = 'inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-all focus:ring-2 focus:ring-[#635bff] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-950'

  const variants = {
    primary: 'bg-[#0a2540] text-white shadow-[0_12px_30px_rgba(10,37,64,0.20)] hover:-translate-y-0.5 hover:bg-[#173b5c] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
    secondary: 'bg-white/70 text-slate-950 ring-1 ring-slate-200 hover:bg-white dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700',
    outline: 'border border-slate-300/80 bg-white/65 text-slate-900 hover:border-[#635bff]/50 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:hover:bg-slate-900',
    ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-[15px]',
  }

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-white/70 text-[#635bff] ring-[#635bff]/20 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-900',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900',
    danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function ProgressBar({ value, max = 100, label = '', animated = true, className = '' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={className}>
      {label && <p className="mb-2 text-sm font-medium">{label}</p>}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-400"
        />
      </div>
      {max && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {Math.round(percentage)}% ({value} of {max})
        </p>
      )}
    </div>
  )
}

export function StatCard({ label, value, unit = '', icon: Icon, trend, trendUp = true }) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="ml-1 text-base text-slate-500 dark:text-slate-400">{unit}</span>}
        </p>
        {trend && (
          <p className={`mt-2 text-xs ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {trendUp ? 'Up' : 'Down'} {trend}
          </p>
        )}
      </div>
      {Icon && (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <Icon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
        </div>
      )}
    </Card>
  )
}

export function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 dark:bg-slate-900 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl dark:bg-slate-900 ${sizes[size]}`}
      >
        {title && (
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              x
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  )
}

export { default as WorkspaceTopNav } from './WorkspaceTopNav'

export { default as StickyNextStep } from './StickyNextStep'

export { default as GuestBanner } from './GuestBanner'

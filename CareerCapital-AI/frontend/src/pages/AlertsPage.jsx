import React, { useEffect, useState } from 'react'
import { AlertTriangle, Bell, CalendarDays, Clock3, FileText } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components'
import { userService } from '../services/api'
import { getProfileStrength } from '../utils/workspace'

export default function AlertsPage() {
  const [profileCenter, setProfileCenter] = useState({ profile: null, documents: [] })
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    let mounted = true
    Promise.all([
      userService.getProfileCenter(),
      userService.syncAlerts().catch(() => userService.getAlerts()),
    ])
      .then(([profileResponse, alertResponse]) => {
        if (!mounted) return
        setProfileCenter({ profile: profileResponse.data.profile, documents: profileResponse.data.documents || [] })
        setAlerts(alertResponse.data.alerts || [])
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const profileStrength = getProfileStrength(profileCenter.profile, profileCenter.documents)
  const groups = alertGroupsFromAlerts(alerts)
  const nextAlert = alerts[0]

  const handleMarkRead = async (alertId) => {
    await userService.markAlertRead(alertId, true).catch(() => {})
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))
  }

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="page-shell">
        <PageHeader
          eyebrow="Planning signals"
          title="Alerts"
          description="Track upcoming deadlines, exam windows, registrations, and readiness issues from one place."
          actions={<Badge variant={profileStrength >= 80 ? 'success' : 'warning'}>{profileStrength}% profile strength</Badge>}
        />

        {nextAlert && (
          <div className="mb-8 rounded-[1.75rem] border border-amber-200/60 bg-amber-50/70 p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Priority reminder</p>
                <p className="mt-1 text-sm leading-7 text-amber-800/90 dark:text-amber-100/80">
                  {nextAlert.title} - {nextAlert.detail}
                </p>
                <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">Due by {nextAlert.dueDate}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group) => {
            const Icon = getGroupIcon(group.title)
            return (
              <Card key={group.title} hover={false}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-700 dark:bg-white/8 dark:text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{group.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{group.items.length} active signal{group.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className={`rounded-2xl px-4 py-3 ${item.isRead ? 'bg-slate-100/80 dark:bg-slate-900/40' : 'bg-slate-50 dark:bg-slate-950/45'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.detail}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClass(item.severity)}`}>
                            {item.severity}
                          </span>
                          {!item.isRead && (
                            <Button size="sm" variant="ghost" className="px-0 py-0 text-xs" onClick={() => handleMarkRead(item.id)}>
                              Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Due by {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function alertGroupsFromAlerts(alerts) {
  const groups = ['College Opening', 'Scholarship Deadline', 'Exam Date', 'Registration', 'Document Missing']
  return groups
    .map((group) => ({ title: group, items: alerts.filter((alert) => alert.type === group) }))
    .filter((group) => group.items.length)
}

function getGroupIcon(title) {
  if (title === 'Scholarship Deadline') return CalendarDays
  if (title === 'Exam Date') return Clock3
  if (title === 'Registration' || title === 'Document Missing') return FileText
  return Bell
}

function severityClass(level) {
  if (level === 'high') return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
  if (level === 'medium') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
}

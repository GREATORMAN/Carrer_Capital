import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  FolderOpen,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { Badge, Button, Card, ProgressBar } from '../components'
import { colleges } from '../data/colleges'
import { userService } from '../services/api'
import { useAuthStore, useCollegeStore } from '../store'
import { filterAndRankColleges, getTotalCost } from '../utils/collegeSearch'
import {
  buildWorkspaceAlerts,
  getCurrentStage,
  getProfileGaps,
  getProfileStrength,
  journeyStages
} from '../utils/workspace'

export default function Dashboard() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const { recentlyViewedIds } = useCollegeStore()
  const [profileCenter, setProfileCenter] = useState({ profile: null, documents: [] })
  const [shortlist, setShortlist] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [{ data }, shortlistResponse] = await Promise.all([
          userService.getProfileCenter(),
          userService.getShortlist().catch(() => ({ data: { shortlist: [] } })),
        ])
        if (mounted) {
          setProfileCenter({
            profile: data.profile,
            documents: data.documents || [],
          })
          setShortlist(shortlistResponse.data.shortlist || [])
        }
      } catch {
        // Fallback handled smoothly
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const currentStage = getCurrentStage(location.pathname)
  const profileStrength = getProfileStrength(profileCenter.profile, profileCenter.documents)
  const profileGaps = getProfileGaps(profileCenter.profile, profileCenter.documents)

  // Document Vault Metrics
  const docTotal = 5
  const docUploaded = profileCenter.documents.filter(d => d.status === 'uploaded').length
  const docMissing = docTotal - docUploaded
  const docScore = Math.round((docUploaded / docTotal) * 100)

  // Financial Stress & Loan Metrics
  const loanEstimate = 2800000 // 28L
  const financialStress = 62
  const getStressColor = (score) => {
    if (score < 40) return 'text-red-600 bg-red-100'
    if (score < 70) return 'text-amber-600 bg-amber-100'
    return 'text-emerald-600 bg-emerald-100'
  }
  const getStressColorBg = (score) => {
    if (score < 40) return 'bg-red-500'
    if (score < 70) return 'bg-amber-500'
    return 'bg-emerald-500'
  }
  const stressBand = financialStress < 40 ? 'High' : financialStress < 70 ? 'Moderate' : 'Comfortable'

  const saved = shortlist
    .map((item) => ({ ...colleges.find((c) => c.id === item.collegeId), applicationStatus: item.applicationStatus }))
    .filter((item) => item?.id)
    .slice(0, 3)

  const workspaceAlerts = buildWorkspaceAlerts(profileCenter.profile, profileCenter.documents, saved)

  // Fake matched scholarships
  const matchedScholarships = [
    { id: 1, name: 'Global Excellence Award', sponsor: 'Govt. of Canada', amount: '₹5,000,000', deadline: 14 },
    { id: 2, name: 'Stem Future Leaders', sponsor: 'University of Toronto', amount: '30% Tuition', deadline: 28 },
    { id: 3, name: 'Women in Tech Grant', sponsor: 'Tech Corp', amount: '₹1,500,000', deadline: 45 },
  ]

  return (
    <div className="min-h-screen py-8 pb-24 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 1. AI Recommendation Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl bg-gradient-to-r from-[#0a2540] to-[#173b5c] p-1">
          <div className="flex items-center justify-between rounded-xl bg-[#0a2540] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#00d4ff]">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white sm:text-base">
                  Based on your profile, Canada with a ₹28L loan is your safest choice.
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5 text-emerald-400" /> High Confidence</span>
                  <span>•</span>
                  <span>Projected Stress Score: 62 (Moderate)</span>
                </div>
              </div>
            </div>
            <Link to="/ai-engine" className="hidden shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 sm:block">
              See Full Report
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* 2. Current Stage Indicator */}
          <Card hover={false} className="bg-slate-900 border-slate-800 text-white dark:bg-slate-950 dark:border-slate-800">
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Current Stage</p>
                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/10 text-2xl font-bold text-teal-400">
                    {currentStage.number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">{currentStage.label}</h2>
                    <p className="mt-1 text-sm text-slate-400">{currentStage.detail}</p>
                  </div>
                </div>
              </div>
              <Link to={currentStage.href} className="mt-6 block">
                <Button className="w-full justify-between bg-teal-500 hover:bg-teal-600 text-slate-950">
                  <span>Continue {currentStage.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* 3. Profile Completion Bar */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Profile Readiness</p>
              <span className="text-lg font-bold text-[#0a2540] dark:text-white">{profileStrength}%</span>
            </div>
            <ProgressBar value={profileStrength} max={100} animated={false} />
            
            <div className="mt-6 space-y-3">
              {profileGaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{gap}</p>
                  </div>
                  <Link to="/profile-enhancer">
                    <span className="text-xs font-semibold text-[#635bff] hover:underline">Fix now</span>
                  </Link>
                </div>
              ))}
              {profileGaps.length === 0 && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Profile is fully optimized for applications.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Grid Widgets */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* 4. Financial Stress Score */}
          <Card hover={false} className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0a2540] dark:text-white">Financial Stress</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStressColor(financialStress)}`}>
                {stressBand}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-bold tracking-tight text-[#0a2540] dark:text-white">{financialStress}</span>
              <span className="text-slate-500 mb-1">/ 100</span>
            </div>
            <div className="space-y-4">
              <FactorBar label="Loan-to-Salary Ratio" value={65} color="bg-[#635bff]" />
              <FactorBar label="Scholarship Coverage" value={30} color="bg-teal-400" />
              <FactorBar label="Repayment Runway" value={80} color="bg-emerald-400" />
            </div>
          </Card>

          {/* 5. Loan Tracker */}
          <Card hover={false} className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-[#0a2540] dark:text-white mb-4">Loan Tracker</h3>
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900 mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Outstanding Balance</p>
              <p className="text-3xl font-bold tracking-tight text-[#0a2540] dark:text-white mt-1">₹{loanEstimate.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs text-slate-500">Next EMI</p>
                <p className="font-semibold mt-1">₹47,869</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs text-slate-500">Remaining</p>
                <p className="font-semibold mt-1">112 mos</p>
              </div>
            </div>
            <Link to="/emi-calculator" className="mt-4 block">
              <Button variant="outline" className="w-full">Model Repayment</Button>
            </Link>
          </Card>

          {/* 9. Upcoming Alerts */}
          <Card hover={false} className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0a2540] dark:text-white">Alerts & Reminders</h3>
              <Badge variant="danger">{workspaceAlerts.length} Action{workspaceAlerts.length !== 1 && 's'}</Badge>
            </div>
            <div className="space-y-3">
              {workspaceAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                  <div className={`mt-0.5 shrink-0 ${alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'}`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{alert.detail}</p>
                  </div>
                </div>
              ))}
              {!workspaceAlerts.length && (
                <p className="text-sm text-slate-500">You are all caught up!</p>
              )}
            </div>
            <Link to="/alerts" className="mt-4 block text-center text-sm font-semibold text-[#635bff]">View All Alerts</Link>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 6. Saved Colleges */}
          <Card hover={false} className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0a2540] dark:text-white">Saved Colleges</h3>
              <Link to="/college-finder" className="text-sm font-semibold text-[#635bff]">View All</Link>
            </div>
            <div className="space-y-3">
              {saved.length ? saved.map((college) => (
                <div key={college.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0a2540] dark:text-white">{college.university}</p>
                    <p className="truncate text-xs text-slate-500">{college.course}</p>
                  </div>
                  <div className="ml-3 flex shrink-0 flex-col items-end">
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Target className="h-3 w-3" /> {college.admissionProbability}%
                    </div>
                    <span className="mt-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {String(college.applicationStatus || 'saved').replaceAll('_', ' ')}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No colleges saved yet. Explore finder to shortlist.</p>
              )}
            </div>
          </Card>

          {/* 7. Matched Scholarships */}
          <Card hover={false} className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0a2540] dark:text-white">Matched Funds</h3>
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {matchedScholarships.map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-[#0a2540] dark:text-white">{s.name}</p>
                    <span className="text-xs font-bold text-teal-600">{s.amount}</span>
                  </div>
                  <p className="text-xs text-slate-500">{s.sponsor}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-500/10">
                      {s.deadline} days left
                    </span>
                    <button className="text-xs font-semibold text-[#635bff] hover:underline">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  )
}

function FactorBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-bold text-slate-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  Globe,
  Search,
  Trophy 
} from 'lucide-react'
import { Button, Card, Badge, PageHeader, InputField } from '../components'

const SCHOLARSHIPS = [
  {
    id: 1,
    name: 'Global Excellence Award',
    sponsor: 'Govt. of Canada',
    amount: '₹5,000,000',
    deadlineDays: 14,
    tags: ['GPA > 3.5', 'STEM', 'Essay Required'],
    match: 94,
    status: 'saved', // saved, applied, null
    steps: [
      { id: 1, title: 'Verify eligibility against profile', completed: true },
      { id: 2, title: 'Gather required documents', completed: true },
      { id: 3, title: 'Draft and review SOP', completed: false },
      { id: 4, title: 'Submit via official portal', completed: false },
      { id: 5, title: 'Track status in Application Tracker', completed: false },
    ]
  },
  {
    id: 2,
    name: 'Stem Future Leaders',
    sponsor: 'University of Toronto',
    amount: '30% Tuition',
    deadlineDays: 28,
    tags: ['Data Science', 'IELTS > 7.5'],
    match: 88,
    status: null,
    steps: [
      { id: 1, title: 'Verify eligibility against profile', completed: false },
      { id: 2, title: 'Gather required documents', completed: false },
      { id: 3, title: 'Draft and review SOP', completed: false },
      { id: 4, title: 'Submit via official portal', completed: false },
      { id: 5, title: 'Track status in Application Tracker', completed: false },
    ]
  },
  {
    id: 3,
    name: 'Women in Tech Grant',
    sponsor: 'Tech Corp',
    amount: '₹1,500,000',
    deadlineDays: 45,
    tags: ['Women in Tech', 'Computer Science'],
    match: 98,
    status: 'applied',
    steps: [
      { id: 1, title: 'Verify eligibility against profile', completed: true },
      { id: 2, title: 'Gather required documents', completed: true },
      { id: 3, title: 'Draft and review SOP', completed: true },
      { id: 4, title: 'Submit via official portal', completed: true },
      { id: 5, title: 'Track status in Application Tracker', completed: true },
    ]
  }
]

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="page-shell py-8 pb-24">
      <PageHeader
        eyebrow="Stage 05"
        title="Scholarship Planning"
        description="Find and apply for funding opportunities perfectly matched to your profile and target universities."
        actions={
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter Matches
          </Button>
        }
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Content: Scholarship List */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <InputField
                placeholder="Search by country, course, or sponsor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <option>Match Score (High to Low)</option>
                <option>Deadline (Closing Soon)</option>
                <option>Amount (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {SCHOLARSHIPS.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                isExpanded={expandedId === scholarship.id}
                onToggle={() => setExpandedId(expandedId === scholarship.id ? null : scholarship.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar: Finder Inputs & Tracking */}
        <div className="space-y-6">
          <Card hover={false} className="border-teal-100 bg-teal-50/50 dark:border-teal-900/30 dark:bg-teal-900/10">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Trophy className="h-5 w-5 text-teal-600" /> My Tracker
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Saved</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">1</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Applied</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Funded</span>
                <span className="text-lg font-bold text-teal-600 dark:text-teal-400">₹0</span>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Globe className="h-5 w-5 text-[#635bff]" /> Finder Inputs
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Country</p>
                <p className="font-medium text-slate-900 dark:text-white">Canada, USA</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Field of Study</p>
                <p className="font-medium text-slate-900 dark:text-white">Data Science / CS</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current GPA</p>
                <p className="font-medium text-slate-900 dark:text-white">3.8 / 4.0</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Funding Gap</p>
                <p className="font-medium text-rose-600 dark:text-rose-400">₹2,800,000</p>
              </div>
              <Button variant="outline" className="w-full mt-2" size="sm">Update Profile</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ScholarshipCard({ scholarship, isExpanded, onToggle }) {
  const isApplied = scholarship.status === 'applied'
  const isSaved = scholarship.status === 'saved'

  return (
    <Card hover={false} className={`transition-all ${isExpanded ? 'ring-2 ring-teal-500/50' : ''}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{scholarship.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{scholarship.sponsor}</p>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Badge variant="success">{scholarship.match}% Match</Badge>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {scholarship.tags.map(tag => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 border-t border-slate-100 pt-4 md:w-48 md:items-end md:border-0 md:pt-0 dark:border-slate-800">
          <div className="hidden md:block">
            <Badge variant="success">{scholarship.match}% Match Profile</Badge>
          </div>
          <div className="text-left md:text-right">
            <p className="text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400">{scholarship.amount}</p>
            <p className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-1 dark:text-amber-500">
              <CalendarClock className="h-3.5 w-3.5" /> {scholarship.deadlineDays} days remaining
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant={isApplied ? 'secondary' : 'primary'} className="flex-1 sm:flex-none">
          {isApplied ? 'View Application' : 'Apply Now'}
        </Button>
        {!isApplied && (
          <Button variant={isSaved ? 'secondary' : 'outline'} className="flex-1 sm:flex-none">
            {isSaved ? 'Saved' : 'Save for later'}
          </Button>
        )}
        <button 
          onClick={onToggle}
          className="ml-auto flex items-center gap-1 text-sm font-semibold text-[#635bff] hover:underline"
        >
          {isExpanded ? 'Hide Steps' : 'View Step-by-Step Guide'}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/50"
        >
          <h4 className="mb-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-[#635bff]" /> Apply Guide
          </h4>
          <div className="space-y-4">
            {scholarship.steps.map((step, idx) => (
              <div key={step.id} className="relative flex gap-4">
                {idx !== scholarship.steps.length - 1 && (
                  <div className={`absolute left-3.5 top-8 h-full w-[2px] -translate-x-1/2 ${step.completed ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                )}
                <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 ${step.completed ? 'border-teal-500 text-teal-500' : 'border-slate-300 text-slate-400 dark:border-slate-600'}`}>
                  {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{step.id}</span>}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${step.completed ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {step.title}
                  </p>
                  {!step.completed && idx === scholarship.steps.findIndex(s => !s.completed) && (
                    <Button variant="outline" size="sm" className="mt-2 text-xs">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  )
}

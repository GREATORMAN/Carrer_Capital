import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, Circle, Lock, Zap } from 'lucide-react'
import { Badge, Button, Card, PageHeader, ProgressBar } from '../components'

export default function ProgressTracker() {
  const stages = [
    { id: 1, title: 'Career Discovery', description: 'Explore careers matching your profile and interests.', status: 'completed', progress: 100, details: 'Identified: Software Engineer, Data Scientist', icon: CheckCircle },
    { id: 2, title: 'Admission Planning', description: 'Research universities and programs.', status: 'completed', progress: 100, details: 'Applied to 8 universities in US and Canada', icon: CheckCircle },
    { id: 3, title: 'Profile Enhancement', description: 'Strengthen your application.', status: 'in-progress', progress: 65, details: 'TOEFL: 110/120, portfolio in progress', icon: Zap },
    { id: 4, title: 'Cost Planning', description: 'Estimate education and living costs.', status: 'in-progress', progress: 45, details: 'Target budget: Rs 35-45L', icon: Circle },
    { id: 5, title: 'Loan Intelligence', description: 'Understand loan terms and options.', status: 'not-started', progress: 0, details: 'Research different loan providers', icon: Circle },
    { id: 6, title: 'Smart Repayment', description: 'Plan EMI and repayment strategy.', status: 'not-started', progress: 0, details: 'Optimize tenure and interest savings', icon: Lock },
    { id: 7, title: 'Visa Planning', description: 'Prepare visa applications.', status: 'not-started', progress: 0, details: 'Gather documents and prepare for interview', icon: Lock },
    { id: 8, title: 'Mentorship', description: 'Connect with mentors in your field.', status: 'not-started', progress: 0, details: 'Get guidance from alumni and professionals', icon: Lock },
    { id: 9, title: 'Living Setup', description: 'Arrange accommodation and logistics.', status: 'not-started', progress: 0, details: 'Find housing and settle in your city', icon: Lock },
    { id: 10, title: 'Success Tracking', description: 'Track finances and career progress.', status: 'not-started', progress: 0, details: 'Monitor career and financial milestones', icon: Lock },
  ]

  const [expandedStages, setExpandedStages] = useState([1, 2, 3])
  const toggleExpand = (id) => setExpandedStages((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  const completedCount = stages.filter((s) => s.status === 'completed').length
  const inProgressCount = stages.filter((s) => s.status === 'in-progress').length
  const totalProgress = Math.round((completedCount / stages.length) * 100)

  const statusBadge = (status) => {
    if (status === 'completed') return <Badge variant="success">Done</Badge>
    if (status === 'in-progress') return <Badge variant="warning">In progress</Badge>
    return <Badge>Locked</Badge>
  }

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="page-shell max-w-6xl">
        <PageHeader
          eyebrow="Progress tracker"
          title="Track the complete student planning journey."
          description="Keep career, admissions, loan, visa, mentorship, and living setup stages organized in one roadmap."
        />

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card hover={false}><p className="text-sm text-slate-500">Total progress</p><p className="mt-2 text-3xl font-bold">{totalProgress}%</p></Card>
          <Card hover={false}><p className="text-sm text-slate-500">Completed</p><p className="mt-2 text-3xl font-bold text-emerald-600">{completedCount}</p></Card>
          <Card hover={false}><p className="text-sm text-slate-500">In progress</p><p className="mt-2 text-3xl font-bold text-amber-600">{inProgressCount}</p></Card>
          <Card hover={false}><p className="text-sm text-slate-500">Next step</p><p className="mt-2 text-lg font-bold">Cost Planning</p></Card>
        </div>

        <Card hover={false} className="mb-8">
          <ProgressBar label="Overall journey progress" value={totalProgress} max={100} animated={false} />
        </Card>

        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const isExpanded = expandedStages.includes(stage.id)
            return (
              <motion.div key={stage.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                <Card hover={false} className="cursor-pointer" onClick={() => toggleExpand(stage.id)}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 font-bold dark:bg-slate-800">{stage.id}</div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Icon className="mt-1 h-5 w-5 text-sky-600" />
                          <div>
                            <h3 className="text-lg font-bold">{stage.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stage.description}</p>
                          </div>
                        </div>
                        {statusBadge(stage.status)}
                      </div>
                      {stage.progress > 0 && <ProgressBar value={stage.progress} max={100} animated={false} />}
                      {isExpanded && (
                        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                          <p className="text-sm font-medium">Current status</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stage.details}</p>
                          {stage.status === 'in-progress' && <Button size="sm" className="mt-4">Continue stage</Button>}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Card hover={false} className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold"><BookOpen className="h-5 w-5 text-sky-600" /> Milestones</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {['50% complete: premium insights', '75% complete: mentorship session', '100% complete: lifetime support access'].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">{item}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

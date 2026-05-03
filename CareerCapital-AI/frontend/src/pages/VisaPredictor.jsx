import React from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CheckCircle, ShieldCheck } from 'lucide-react'
import { Badge, Button, Card, PageHeader, ProgressBar } from '../components'

export default function VisaPredictor() {
  const predictionData = [
    { factor: 'GPA', score: 95 },
    { factor: 'TOEFL', score: 110 },
    { factor: 'Work Exp', score: 75 },
    { factor: 'LOR Quality', score: 85 },
    { factor: 'SOP', score: 90 },
    { factor: 'Financial', score: 88 },
  ]

  const successData = [
    { month: 'Month 1', probability: 60, confidence: 75 },
    { month: 'Month 2', probability: 68, confidence: 80 },
    { month: 'Month 3', probability: 76, confidence: 85 },
    { month: 'Month 4', probability: 82, confidence: 88 },
    { month: 'Month 5', probability: 87, confidence: 90 },
    { month: 'Month 6', probability: 92, confidence: 92 },
  ]

  const factors = [
    { title: 'Strong academic profile', check: true },
    { title: 'Good English proficiency', check: true },
    { title: 'Clear career goals', check: true },
    { title: 'Demonstrated financial capacity', check: true },
    { title: 'Strong recommendation letters', check: false },
    { title: 'Distinct statement of purpose', check: false },
  ]

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="page-shell max-w-6xl">
        <PageHeader
          eyebrow="Visa readiness"
          title="Understand your visa and risk profile."
          description="Review success probability, risk areas, and preparation gaps before final application submission."
        />

        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2">
            <Card hover={false} className="border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Visa success probability</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Updated today</p>
                </div>
                <Badge variant="success">6-month forecast</Badge>
              </div>
              <div className="mb-8 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
                <div className="rounded-lg bg-white p-8 text-center ring-1 ring-sky-200 dark:bg-slate-950 dark:ring-sky-900">
                  <p className="text-5xl font-bold text-sky-600">87%</p>
                  <p className="mt-2 text-sm text-slate-500">Success probability</p>
                </div>
                <div>
                  <ProgressBar label="Current readiness" value={87} max={100} animated={false} />
                  <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                    Good chances. Focus next on recommendation letters and SOP strength.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <Card hover={false}>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-5 w-5 text-sky-600" /> Risk assessment</h3>
            <div className="space-y-3">
              {[['Financial', 'Low'], ['Academic', 'Low'], ['Language', 'Low'], ['Experience', 'Medium']].map(([risk, level]) => (
                <div key={risk} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                  <span className="text-sm font-medium">{risk}</span>
                  <Badge variant={level === 'Low' ? 'success' : 'warning'}>{level}</Badge>
                </div>
              ))}
            </div>
            <Button className="mt-5 w-full">Get detailed report</Button>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card hover={false}>
            <h3 className="mb-6 text-xl font-bold">Profile factors</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="factor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card hover={false}>
            <h3 className="mb-6 text-xl font-bold">Probability over time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={successData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="probability" stroke="#0ea5e9" name="Success %" />
                <Line type="monotone" dataKey="confidence" stroke="#14b8a6" name="Confidence %" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card hover={false} className="mt-8">
          <h3 className="mb-6 text-xl font-bold">Success factors checklist</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {factors.map((factor) => (
              <div key={factor.title} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                {factor.check ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <div className="h-5 w-5 rounded-full border-2 border-slate-400" />}
                <span className={factor.check ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}>{factor.title}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

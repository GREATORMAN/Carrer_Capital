import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  CircleDollarSign,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import { Badge, Button, Card, ProgressBar } from '../components'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  const features = [
    { icon: Brain, title: 'Decision intelligence', description: 'Unify career fit, country strategy, program ROI, and readiness scores in one planning model.' },
    { icon: WalletCards, title: 'Loan command center', description: 'Compare repayment paths, monthly cash flow, interest exposure, and prepayment impact.' },
    { icon: ShieldCheck, title: 'Readiness controls', description: 'Track visa, profile, funding, living setup, and mentorship milestones with clear ownership.' },
  ]

  const metrics = [
    ['Funding readiness', 78, 'Rs 45L plan'],
    ['Visa confidence', 86, 'Low risk'],
    ['Profile strength', 72, '3 gaps left'],
  ]

  const workflow = ['Career fit', 'Program shortlist', 'Funding model', 'Visa readiness', 'Mentor review', 'Arrival plan']

  return (
    <div className="overflow-hidden">
      <section className="relative soft-grid">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/50 shadow-[0_0_22px_rgba(34,211,238,0.65)]"
              style={{ left: `${8 + (i * 7) % 86}%`, top: `${14 + (i * 11) % 68}%` }}
              animate={{ y: [0, -18, 0], opacity: [0.25, 0.9, 0.25], scale: [0.8, 1.35, 0.8] }}
              transition={{ duration: 3.4 + i * 0.18, repeat: Infinity, ease: "easeInOut", delay: i * 0.16 }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[linear-gradient(115deg,rgba(99,91,255,0.22),rgba(0,212,255,0.16)_42%,rgba(0,200,150,0.12)_70%,transparent)]" />
        <div className="page-shell grid min-h-[calc(100vh-5rem)] items-center gap-14 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <Badge className="mb-7 gap-2 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI operating system for student decisions
            </Badge>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[#0a2540] dark:text-white sm:text-6xl lg:text-7xl">
              Financial clarity for every career move abroad.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              CareerCapital turns admissions, loans, visa readiness, mentorship, and living-cost planning into a single executive-grade workspace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup"><Button size="lg" className="w-full gap-2 sm:w-auto">Start free <ArrowRight className="h-5 w-5" /></Button></Link>
              <Link to="/dashboard"><Button variant="secondary" size="lg" className="w-full gap-2 sm:w-auto">View dashboard</Button></Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              {['No scattered spreadsheets', 'AI-guided next steps', 'Built for repeat planning'].map((item) => (
                <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} whileHover={{ rotateX: 2, rotateY: -3, scale: 1.015 }} className="relative perspective-1000">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_20%_20%,rgba(99,91,255,0.28),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,212,255,0.28),transparent_32%),radial-gradient(circle_at_60%_80%,rgba(0,200,150,0.22),transparent_35%)] blur-2xl" />
            <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-3 shimmer-line shadow-[0_30px_110px_rgba(10,37,64,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80">
              <div className="rounded-[1.35rem] border border-slate-200/70 bg-[#f7fafc] p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0a2540] dark:text-white">CareerCapital workspace</p>
                    <p className="text-xs text-slate-500">Fall 2026 planning board</p>
                  </div>
                  <Badge variant="success">Live plan</Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl bg-[#0a2540] p-5 text-white shadow-[0_18px_60px_rgba(10,37,64,0.25)]">
                    <div className="mb-7 flex items-center justify-between">
                      <GraduationCap className="h-8 w-8 text-cyan-300" />
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">82% ready</span>
                    </div>
                    <p className="text-sm text-slate-300">Recommended path</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">MS Data Science</p>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">Canada or Germany, 18-24 month route with strong repayment potential.</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">ROI score</p><p className="text-xl font-semibold">8.2</p></div>
                      <div className="rounded-xl bg-white/10 p-3"><p className="text-xs text-slate-300">Timeline</p><p className="text-xl font-semibold">24 mo</p></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {metrics.map(([label, value, note]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold">{label}</p>
                          <p className="text-sm font-bold text-[#635bff]">{value}%</p>
                        </div>
                        <ProgressBar value={value} max={100} animated={false} />
                        <p className="mt-3 text-xs text-slate-500">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {[['Monthly EMI', 'Rs 47,869', CircleDollarSign], ['Interest saved', 'Rs 5.2L', LineChart], ['Visa risk', 'Low', ShieldCheck]].map(([label, value, Icon]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <Icon className="mb-3 h-5 w-5 text-[#635bff]" />
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Platform</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] dark:text-white sm:text-5xl">A SaaS-grade workspace for high-stakes student planning.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Every module is designed to reduce ambiguity, improve financial decisions, and keep the journey moving.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.08, duration: 0.45 }}>
                  <Card className="group h-full p-7">
                    <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#635bff]/10 text-[#635bff] group-hover:bg-[#635bff] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-[#0a2540] dark:text-white">{feature.title}</h3>
                    <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="section-kicker">Workflow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] dark:text-white">From first shortlist to first month abroad.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">CareerCapital converts a messy process into a clean operating rhythm with visible ownership and readiness states.</p>
            <Link to="/progress" className="mt-8 inline-flex"><Button variant="outline" className="gap-2">Open roadmap <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {workflow.map((stage, index) => (
              <motion.div key={stage} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a2540] text-sm font-semibold text-white">{String(index + 1).padStart(2, '0')}</div>
                <p className="font-semibold text-[#0a2540] dark:text-white">{stage}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0a2540] p-8 text-white shadow-[0_30px_100px_rgba(10,37,64,0.28)] sm:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#635bff]/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <BarChart3 className="mb-6 h-10 w-10 text-cyan-300" />
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Make the numbers visible before the decision gets expensive.</h2>
                <p className="mt-5 max-w-2xl leading-7 text-slate-300">Start with the EMI simulator, then connect career ROI, visa readiness, profile progress, and living costs into one plan.</p>
              </div>
              <Link to="/signup"><Button size="lg" className="w-full gap-2 !bg-white !text-[#0a2540] hover:!bg-slate-100 sm:w-auto">Create free account <ArrowRight className="h-5 w-5" /></Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

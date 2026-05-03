import React, { useEffect, useState } from 'react'
import { ExternalLink, Link2, Loader2, PlayCircle, Quote, Search, Send, Sparkles } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components'
import { aiService, userService } from '../services/api'
import { getProfileStrength } from '../utils/workspace'

const starterPrompts = [
  'Best MS in Data Science under Rs 25L with strong visa outcomes',
  'How should I improve my SOP for Canada PG programs?',
  'What loan repayment strategy is best for my current EMI?',
]

const fallbackResponse = {
  text: 'The decision engine is warming up. Use the dashboard, profile center, and college finder together for the next best move.',
  links: [{ title: 'Open dashboard', url: '/dashboard', type: 'internal' }],
  videos: [{ title: 'Study abroad planning roadmap', url: 'https://www.youtube.com/results?search_query=study+abroad+planning+roadmap' }],
  reviews: ['Students make faster progress when profile completion and deadlines stay visible together.'],
  suggestedStage: '01',
  colleges: [],
  bankPlans: [],
}

export default function AIEngine() {
  const [query, setQuery] = useState(starterPrompts[0])
  const [submitted, setSubmitted] = useState(starterPrompts[0])
  const [response, setResponse] = useState(fallbackResponse)
  const [loading, setLoading] = useState(false)
  const [profileStrength, setProfileStrength] = useState(72)
  const [requiredAmountLakhs, setRequiredAmountLakhs] = useState(40)

  useEffect(() => {
    let mounted = true
    userService.getProfileCenter()
      .then(({ data }) => {
        if (mounted) {
          setProfileStrength(getProfileStrength(data.profile, data.documents || []))
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    void runQuery(starterPrompts[0])
  }, [])

  const runQuery = async (value) => {
    const nextQuery = value || starterPrompts[0]
    setSubmitted(nextQuery)
    setLoading(true)
    try {
      const { data } = await aiService.getChatResponse(nextQuery, { profileStrength, requiredAmountLakhs })
      setResponse(data.result || fallbackResponse)
    } catch {
      setResponse(fallbackResponse)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="page-shell">
        <PageHeader
          eyebrow="AI guidance"
          title="AI Engine"
          description="Ask planning questions and get a guided response with relevant links, explainers, and review signals tied to your study abroad journey."
          actions={<Badge>Working assistant</Badge>}
        />

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card hover={false} className="border-teal-200/60 bg-[linear-gradient(135deg,rgba(20,184,166,0.08),rgba(255,255,255,0.65))] dark:border-teal-500/20 dark:bg-[linear-gradient(135deg,rgba(13,148,136,0.14),rgba(15,23,42,0.4))]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-teal-500/12 p-3 text-teal-700 dark:bg-white/8 dark:text-teal-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Ask your doubt</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">This engine now calls the backend assistant and returns structured guidance.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Ask about universities, SOP, budget, loan strategy, visa readiness..."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setQuery(prompt)
                      void runQuery(prompt)
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Loan need estimate</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={requiredAmountLakhs}
                  onChange={(e) => setRequiredAmountLakhs(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Rs {requiredAmountLakhs}L target funding need</p>
              </div>
              <div className="mt-5 flex justify-end">
                <Button className="gap-2" onClick={() => void runQuery(query)} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate guidance'}
                  {!loading && <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-700 dark:bg-white/8 dark:text-sky-300">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Decision engine response</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active query and answer</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
              <p className="font-semibold text-slate-950 dark:text-white">Prompt</p>
              <p className="mt-1">{submitted}</p>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-sm font-semibold">Answer</p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{response.text}</p>
              <div className="mt-4 inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-white/8 dark:text-teal-300">
                Suggested stage: {response.suggestedStage}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ResourceCard
            title="Helpful links"
            icon={Link2}
            items={(response.links || []).map((item) => (
              <a
                key={item.title}
                href={item.url}
                target={item.type === 'external' ? '_blank' : undefined}
                rel={item.type === 'external' ? 'noreferrer' : undefined}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <span>{item.title}</span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          />
          <ResourceCard
            title="Video suggestions"
            icon={PlayCircle}
            items={(response.videos || []).map((item) => (
              <a key={item.title} href={item.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:bg-slate-900">
                <span>{item.title}</span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          />
          <ResourceCard
            title="Review signals"
            icon={Quote}
            items={(response.reviews || []).map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-950/45 dark:text-slate-300">
                {item}
              </div>
            ))}
          />
        </div>

        {(response.colleges?.length || response.bankPlans?.length) ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {response.colleges?.length ? (
              <Card hover={false}>
                <h2 className="mb-4 text-lg font-semibold">Retrieved college matches</h2>
                <div className="space-y-3">
                  {response.colleges.map((college) => (
                    <div key={college.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/45">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{college.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Estimated total cost: Rs {college.totalCostLakhs}L</p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {response.bankPlans?.length ? (
              <Card hover={false}>
                <h2 className="mb-4 text-lg font-semibold">Retrieved loan-plan matches</h2>
                <div className="space-y-3">
                  {response.bankPlans.map((plan) => (
                    <div key={plan.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/45">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{plan.bank} - {plan.planName}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Interest rate: {plan.interestRate}%</p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ResourceCard({ title, icon: Icon, items }) {
  return (
    <Card hover={false}>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-900">
          <Icon className="h-5 w-5 text-sky-600 dark:text-sky-300" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-3">{items}</div>
    </Card>
  )
}

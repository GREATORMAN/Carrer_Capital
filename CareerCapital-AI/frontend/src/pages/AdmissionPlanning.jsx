import React, { useMemo, useState } from 'react'
import { BookOpenCheck, CalendarCheck, FileSearch, GraduationCap, Search, SlidersHorizontal } from 'lucide-react'
import { Badge, Button, Card, PageHeader, ProgressBar } from '../components'
import SmartSearchBar from '../components/SmartSearchBar'
import { colleges, filterOptions } from '../data/colleges'
import { defaultCollegeFilters, filterAndRankColleges, getSmartIntent } from '../utils/collegeSearch'

const studyPlans = {
  UG: [
    'Confirm grade 12 subjects, percentage, and destination eligibility.',
    'Shortlist foundation, diploma, and direct-entry bachelor pathways.',
    'Prepare IELTS/TOEFL, passport, transcripts, and parent financial proofs.',
    'Apply 8-10 months before intake and track scholarship cutoffs.',
  ],
  PG: [
    'Map UG major, GPA, work experience, and test score gaps.',
    'Compare master programs by specialization, ROI, admissions probability, and deadlines.',
    'Finish SOP, resume, LORs, transcripts, English test, and GRE/GMAT where required.',
    'Lock final shortlist across ambitious, target, and safe universities.',
  ],
  PGD: [
    'Prioritize career-focused diplomas with internship or co-op outcomes.',
    'Check academic percentage, backlog tolerance, and English test minimums.',
    'Validate visa, funds, and post-study work rules for the chosen country.',
    'Apply early to public colleges and keep a second intake backup.',
  ],
  PhD: [
    'Define research theme, supervisors, publications, and funding fit.',
    'Prepare research proposal, academic CV, writing sample, and references.',
    'Contact supervisors before formal applications where the country expects it.',
    'Track funded deadlines separately from self-funded admission windows.',
  ],
}

export default function AdmissionPlanning() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(defaultCollegeFilters)
  const [activeLevel, setActiveLevel] = useState('PG')
  const [showFilters, setShowFilters] = useState(true)

  const results = useMemo(() => filterAndRankColleges(colleges, query, filters).slice(0, 6), [query, filters])
  const selectedCollege = results[0]
  const intent = getSmartIntent(query)

  const setFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }))

  return (
    <div className="min-h-screen soft-grid py-10 pb-24">
      <div className="page-shell">
        <PageHeader
          eyebrow="Admission planning"
          title="Plan colleges, courses, requirements, and study level strategy."
          description="Use one workspace for college search, course filters, requirement checks, and UG, PG, PGD, or PhD planning."
          actions={<Button variant="secondary" className="gap-2" onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal className="h-4 w-4" />Filters</Button>}
        />

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-2 text-sky-700 dark:text-sky-300">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#0a2540] dark:text-white">Search colleges and courses</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Try country, budget, course, GRE, scholarship, or salary terms.</p>
              </div>
            </div>
            <SmartSearchBar value={query} onChange={setQuery} onSubmit={setQuery} />
            <div className="mt-4 flex flex-wrap gap-2">
              {['PG computer science Canada', 'UG business under Rs 35L', 'PGD with co-op Canada', 'No GRE scholarships'].map((chip) => (
                <button key={chip} onClick={() => setQuery(chip)} className="rounded-full border border-slate-200 bg-white/75 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {chip}
                </button>
              ))}
            </div>
            {query && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>AI-ranked</Badge>
                {intent.lowBudget && <Badge variant="success">Budget fit</Badge>}
                {intent.noGre && <Badge variant="success">No GRE</Badge>}
                {intent.scholarship && <Badge variant="success">Scholarship</Badge>}
              </div>
            )}
          </Card>

          <Card hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-teal-500/10 p-2 text-teal-700 dark:text-teal-300">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-[#0a2540] dark:text-white">Study plan</h2>
            </div>
            <div className="mb-5 grid grid-cols-4 gap-2">
              {Object.keys(studyPlans).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setActiveLevel(level)
                    setFilter('courseType', level === 'PhD' ? 'All' : level)
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${activeLevel === level ? 'bg-[#0a2540] text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {studyPlans[activeLevel].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-slate-200/70 bg-white/65 p-3 dark:border-slate-800 dark:bg-slate-950/45">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/12 text-xs font-bold text-teal-700 dark:text-teal-300">{index + 1}</span>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={`grid gap-8 ${showFilters ? 'xl:grid-cols-[280px_1fr_340px]' : 'xl:grid-cols-[1fr_340px]'}`}>
          {showFilters && (
            <aside className="h-fit rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(10,37,64,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
              <h2 className="mb-5 font-semibold text-[#0a2540] dark:text-white">Course filters</h2>
              <div className="space-y-5">
                <FilterSelect label="Country" value={filters.country} onChange={(value) => setFilter('country', value)} options={['All', ...filterOptions.countries]} />
                <FilterSelect label="Study level" value={filters.courseType} onChange={(value) => setFilter('courseType', value)} options={['All', ...filterOptions.courseTypes]} />
                <FilterSelect label="Field" value={filters.field} onChange={(value) => setFilter('field', value)} options={['All', ...filterOptions.fields]} />
                <div>
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>Budget</span>
                    <span>Rs {filters.maxBudget}L</span>
                  </div>
                  <input type="range" min="10" max="70" value={filters.maxBudget} onChange={(e) => setFilter('maxBudget', e.target.value)} className="w-full" />
                </div>
                <FilterSelect label="IELTS" value={filters.ieltsRequired} onChange={(value) => setFilter('ieltsRequired', value)} options={['Any', 'Required', 'Not Required']} />
                <FilterSelect label="GRE" value={filters.greRequired} onChange={(value) => setFilter('greRequired', value)} options={['Any', 'Required', 'Not Required']} />
                <FilterSelect label="Scholarship" value={filters.scholarship} onChange={(value) => setFilter('scholarship', value)} options={['Any', 'Available', 'Not Available']} />
              </div>
            </aside>
          )}

          <main className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">{results.length} programs in this planning window</p>
              <p className="text-xs text-slate-400">Sorted by search fit, cost, ROI, and admission probability.</p>
            </div>
            <div className="grid gap-4">
              {results.map((college) => (
                <Card key={college.id} hover={false} className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{college.courseType}</Badge>
                        <Badge variant={college.scholarship ? 'success' : 'warning'}>{college.scholarship ? 'Scholarship available' : 'Limited scholarship'}</Badge>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[#0a2540] dark:text-white">{college.university}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{college.course}</p>
                      <p className="mt-1 text-xs text-slate-500">{college.city}, {college.country}</p>
                    </div>
                    <div className="min-w-[180px]">
                      <ProgressBar label="Admission probability" value={college.admissionProbability} max={100} animated={false} />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                    <PlanningMetric label="Total cost" value={`Rs ${college.feesLakhs + college.livingLakhs}L`} />
                    <PlanningMetric label="Duration" value={`${college.durationMonths} months`} />
                    <PlanningMetric label="ROI" value={college.roi} />
                  </div>
                </Card>
              ))}
            </div>
          </main>

          <aside className="space-y-5">
            <Card hover={false}>
              <div className="mb-4 flex items-center gap-3">
                <FileSearch className="h-5 w-5 text-[#635bff]" />
                <h2 className="text-lg font-semibold text-[#0a2540] dark:text-white">Requirement check</h2>
              </div>
              {selectedCollege ? (
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <Requirement label="English test" value={selectedCollege.ieltsRequired ? 'IELTS/TOEFL required' : 'Flexible'} />
                  <Requirement label="GRE / GMAT" value={selectedCollege.greRequired ? 'Required' : 'Not required'} />
                  <Requirement label="Academic fit" value={`${selectedCollege.admissionProbability}% estimated chance`} />
                  <Requirement label="Budget fit" value={`Plan Rs ${selectedCollege.feesLakhs + selectedCollege.livingLakhs}L total`} />
                </div>
              ) : (
                <p className="text-sm text-slate-500">Search a program to see requirements.</p>
              )}
            </Card>

            <Card hover={false}>
              <div className="mb-4 flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-teal-700 dark:text-teal-300" />
                <h2 className="text-lg font-semibold text-[#0a2540] dark:text-white">Application flow</h2>
              </div>
              <div className="space-y-3">
                {['Shortlist', 'Requirements', 'Documents', 'Applications', 'Funding'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <BookOpenCheck className={`h-4 w-4 ${index < 2 ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#635bff]/30 dark:border-slate-800 dark:bg-slate-900">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function PlanningMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/65 p-3 dark:border-slate-800 dark:bg-slate-950/45">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-[#0a2540] dark:text-white">{value}</p>
    </div>
  )
}

function Requirement({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/65 p-3 dark:border-slate-800 dark:bg-slate-950/45">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-[#0a2540] dark:text-white">{value}</p>
    </div>
  )
}

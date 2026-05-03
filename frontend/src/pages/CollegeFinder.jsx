import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Sparkles } from 'lucide-react'
import { Badge, Button, PageHeader } from '../components'
import CollegeCard from '../components/CollegeCard'
import ComparisonPanel from '../components/ComparisonPanel'
import SmartSearchBar from '../components/SmartSearchBar'
import { colleges, filterOptions } from '../data/colleges'
import { useCollegeStore } from '../store'
import { userService } from '../services/api'
import { defaultCollegeFilters, filterAndRankColleges, getSmartIntent } from '../utils/collegeSearch'

export default function CollegeFinder() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [filters, setFilters] = useState(defaultCollegeFilters)
  const [showFilters, setShowFilters] = useState(true)
  const [shortlist, setShortlist] = useState([])
  const {
    compareCollegeIds,
    toggleCompareCollege,
    clearCompare,
    addRecentlyViewed,
  } = useCollegeStore()

  useEffect(() => {
    let mounted = true
    userService.getShortlist()
      .then(({ data }) => {
        if (mounted) setShortlist(data.shortlist || [])
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const results = useMemo(() => filterAndRankColleges(colleges, query, filters), [query, filters])
  const compareColleges = colleges.filter((college) => compareCollegeIds.includes(college.id))
  const intent = getSmartIntent(query)
  const shortlistMap = useMemo(() => new Map(shortlist.map((item) => [item.collegeId, item])), [shortlist])

  const setFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }))
  const resetFilters = () => setFilters(defaultCollegeFilters)

  const toggleShortlist = async (college) => {
    const existing = shortlistMap.get(college.id)
    if (existing) {
      await userService.removeShortlistItem(college.id).catch(() => {})
      await userService.syncAlerts().catch(() => {})
      setShortlist((prev) => prev.filter((item) => item.collegeId !== college.id))
      return
    }

    const payload = {
      collegeId: college.id,
      university: college.university,
      course: college.course,
      country: college.country,
      applicationStatus: 'saved',
      officialLink: college.officialLink,
      applyLink: college.applyLink,
    }
    const { data } = await userService.saveShortlistItem(payload).catch(() => ({ data: { item: payload } }))
    await userService.syncAlerts().catch(() => {})
    setShortlist((prev) => [...prev.filter((item) => item.collegeId !== college.id), data.item])
  }

  const updateShortlistStatus = async (college, applicationStatus) => {
    const current = shortlistMap.get(college.id)
    if (!current) return
    const payload = { ...current, applicationStatus }
    const { data } = await userService.updateShortlistItem(college.id, payload).catch(() => ({ data: { item: payload } }))
    await userService.syncAlerts().catch(() => {})
    setShortlist((prev) => prev.map((item) => (item.collegeId === college.id ? data.item : item)))
  }

  return (
    <div className="min-h-screen soft-grid py-10 pb-36">
      <div className="page-shell">
        <PageHeader
          eyebrow="College finder"
          title="Search colleges, courses, and countries with decision support."
          description="Ask natural questions, filter by budget and requirements, compare options, and open official application links in one flow."
          actions={<Button variant="secondary" className="gap-2" onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal className="h-4 w-4" />Filters</Button>}
        />

        <div className="mb-8">
          <SmartSearchBar value={query} onChange={setQuery} onSubmit={setQuery} />
          {query && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="gap-2"><Sparkles className="h-3.5 w-3.5" />AI-ranked results</Badge>
              {intent.lowBudget && <Badge variant="success">Budget optimized</Badge>}
              {intent.highSalary && <Badge variant="success">ROI prioritized</Badge>}
              {intent.noGre && <Badge variant="success">No GRE preferred</Badge>}
              {intent.scholarship && <Badge variant="success">Scholarship preferred</Badge>}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {showFilters && (
            <aside className="h-fit rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(10,37,64,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-[#0a2540] dark:text-white">Refine search</h2>
                <button onClick={resetFilters} className="text-xs font-semibold text-[#635bff]">Reset</button>
              </div>

              <div className="space-y-5">
                <FilterSelect label="Country" value={filters.country} onChange={(value) => setFilter('country', value)} options={['All', ...filterOptions.countries]} />
                <FilterSelect label="Course type" value={filters.courseType} onChange={(value) => setFilter('courseType', value)} options={['All', ...filterOptions.courseTypes]} />
                <FilterSelect label="Field" value={filters.field} onChange={(value) => setFilter('field', value)} options={['All', ...filterOptions.fields]} />
                <div>
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>Budget</span>
                    <span>Rs {filters.maxBudget}L</span>
                  </div>
                  <input type="range" min="10" max="70" value={filters.maxBudget} onChange={(e) => setFilter('maxBudget', e.target.value)} className="w-full" />
                  <div className="mt-1 flex justify-between text-xs text-slate-400"><span>Rs 10L</span><span>Rs 70L</span></div>
                </div>
                <FilterSelect label="IELTS" value={filters.ieltsRequired} onChange={(value) => setFilter('ieltsRequired', value)} options={['Any', 'Required', 'Not Required']} />
                <FilterSelect label="GRE" value={filters.greRequired} onChange={(value) => setFilter('greRequired', value)} options={['Any', 'Required', 'Not Required']} />
                <FilterSelect label="University type" value={filters.universityType} onChange={(value) => setFilter('universityType', value)} options={['All', ...filterOptions.universityTypes]} />
                <FilterSelect label="Scholarship" value={filters.scholarship} onChange={(value) => setFilter('scholarship', value)} options={['Any', 'Available', 'Not Available']} />
              </div>
            </aside>
          )}

          <main>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-500">{results.length} matching programs</p>
                <p className="text-xs text-slate-400">Ranked by search fit, ROI, admission probability, and cost efficiency.</p>
              </div>
              <div className="flex gap-2">
                {['Best MS under Rs 25L with high salary', 'Canada with scholarships', 'No GRE CS programs'].map((chip) => (
                  <button key={chip} onClick={() => setQuery(chip)} className="hidden rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white lg:inline-flex">
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {results.map((college, index) => (
                <motion.div key={college.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                  <CollegeCard
                    college={college}
                    saved={shortlistMap.has(college.id)}
                    compared={compareCollegeIds.includes(college.id)}
                    shortlistStatus={shortlistMap.get(college.id)?.applicationStatus || 'saved'}
                    onSave={() => toggleShortlist(college)}
                    onCompare={() => toggleCompareCollege(college.id)}
                    onView={() => addRecentlyViewed(college.id)}
                    onStatusChange={(status) => updateShortlistStatus(college, status)}
                  />
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <ComparisonPanel colleges={compareColleges} onRemove={toggleCompareCollege} onClear={clearCompare} />
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

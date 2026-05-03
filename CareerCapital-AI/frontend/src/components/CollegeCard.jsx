import React from 'react'
import { ArrowUpRight, Download, Heart, MapPin, Scale, Star } from 'lucide-react'
import { Badge, Button, ProgressBar } from './index'
import { getEmiEstimate, getLoanRequired, getRecommendationReason, getTotalCost } from '../utils/collegeSearch'
import { formatNumber } from '../utils/financial'

export default function CollegeCard({
  college,
  saved,
  compared,
  shortlistStatus = 'saved',
  onSave,
  onCompare,
  onView,
  onStatusChange,
}) {
  const totalCost = getTotalCost(college)
  const loanRequired = getLoanRequired(college)
  const emi = getEmiEstimate(college)

  const downloadDetails = () => {
    const content = [
      `CareerCapital AI College Details`,
      `University: ${college.university}`,
      `Course: ${college.course}`,
      `Location: ${college.city}, ${college.country}`,
      `Total Cost: Rs ${totalCost}L`,
      `Loan Required: Rs ${loanRequired}L`,
      `Estimated EMI: Rs ${formatNumber(emi)}`,
      `Ranking: #${college.ranking}`,
      `ROI: ${college.roi}`,
      `Admission Probability: ${college.admissionProbability}%`,
      `Official Website: ${college.officialLink}`,
    ].join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${college.university.replaceAll(' ', '-')}-${college.course.replaceAll(' ', '-')}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <article className="group rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(10,37,64,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(10,37,64,0.14)] dark:border-white/10 dark:bg-slate-950/75">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge>{college.courseType}</Badge>
            <Badge variant={college.scholarship ? 'success' : 'primary'}>{college.scholarship ? 'Scholarship' : 'Standard aid'}</Badge>
            <Badge variant={college.greRequired ? 'warning' : 'success'}>{college.greRequired ? 'GRE' : 'No GRE'}</Badge>
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#0a2540] dark:text-white">{college.university}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="h-4 w-4" />
            {college.city}, {college.country}
          </p>
        </div>
        <button onClick={onSave} className={`rounded-full p-2 ring-1 transition ${saved ? 'bg-rose-50 text-rose-600 ring-rose-200' : 'bg-white/70 text-slate-500 ring-slate-200 hover:text-rose-600 dark:bg-slate-900 dark:ring-slate-800'}`}>
          <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mb-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Course</p>
        <p className="mt-1 font-semibold text-slate-900 dark:text-white">{college.course}</p>
        <p className="mt-2 text-sm text-slate-500">{college.field} - {college.durationMonths / 12} yrs - {college.universityType}</p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs text-slate-500">Cost</p>
          <p className="mt-1 font-semibold">Rs {totalCost}L</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs text-slate-500">Ranking</p>
          <p className="mt-1 flex items-center gap-1 font-semibold"><Star className="h-4 w-4 text-amber-500" />#{college.ranking}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs text-slate-500">ROI</p>
          <p className="mt-1 font-semibold">{college.roi}</p>
        </div>
      </div>

      <div className="mb-5 space-y-4">
        <ProgressBar label={`Admission probability: ${college.admissionProbability}%`} value={college.admissionProbability} max={100} animated={false} />
        <div className="rounded-2xl border border-[#635bff]/15 bg-[#635bff]/[0.06] p-4">
          <p className="text-sm font-semibold text-[#0a2540] dark:text-white">AI recommendation</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Recommended for {getRecommendationReason(college)}. Estimated loan: Rs {loanRequired}L, EMI: Rs {formatNumber(emi)}.</p>
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <a onClick={onView} href={college.officialLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white">
          Official website <ArrowUpRight className="h-4 w-4" />
        </a>
        <a onClick={onView} href={college.applyLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a2540] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#173b5c] dark:bg-white dark:text-slate-950">
          Apply now <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="flex gap-2">
        <Button variant={compared ? 'primary' : 'secondary'} size="sm" className="flex-1 gap-2" onClick={onCompare}>
          <Scale className="h-4 w-4" />
          {compared ? 'Comparing' : 'Compare'}
        </Button>
        {saved && (
          <select
            value={shortlistStatus}
            onChange={(event) => onStatusChange?.(event.target.value)}
            className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#635bff]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="saved">Saved</option>
            <option value="researching">Researching</option>
            <option value="ready_to_apply">Ready to apply</option>
            <option value="applied">Applied</option>
            <option value="offer_received">Offer received</option>
          </select>
        )}
        <Button variant="ghost" size="sm" className="gap-2" onClick={downloadDetails}>
          <Download className="h-4 w-4" />
          Details
        </Button>
      </div>
    </article>
  )
}

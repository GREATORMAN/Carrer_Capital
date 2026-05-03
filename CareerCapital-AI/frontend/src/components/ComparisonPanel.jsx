import React from 'react'
import { X } from 'lucide-react'
import { Button } from './index'
import { getEmiEstimate, getLoanRequired, getTotalCost } from '../utils/collegeSearch'
import { formatNumber } from '../utils/financial'

export default function ComparisonPanel({ colleges, onRemove, onClear }) {
  if (!colleges.length) return null

  const rows = [
    ['Fees + living', (college) => `Rs ${getTotalCost(college)}L`],
    ['Duration', (college) => `${college.durationMonths / 12} yrs`],
    ['ROI', (college) => college.roi],
    ['Ranking', (college) => `#${college.ranking}`],
    ['Admission probability', (college) => `${college.admissionProbability}%`],
    ['Loan required', (college) => `Rs ${getLoanRequired(college)}L`],
    ['Estimated EMI', (college) => `Rs ${formatNumber(getEmiEstimate(college))}`],
  ]

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-[1.5rem] border border-white/70 bg-white/95 p-4 shadow-[0_30px_100px_rgba(10,37,64,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[#0a2540] dark:text-white">Compare colleges</p>
          <p className="text-xs text-slate-500">Select 2-4 options for a side-by-side decision view.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr>
              <th className="w-40 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-slate-400">Feature</th>
              {colleges.map((college) => (
                <th key={college.id} className="px-3 py-2 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{college.university}</p>
                      <p className="text-xs text-slate-500">{college.course}</p>
                    </div>
                    <button onClick={() => onRemove(college.id)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, getValue]) => (
              <tr key={label} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-500">{label}</td>
                {colleges.map((college) => <td key={college.id} className="px-3 py-2 font-semibold">{getValue(college)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

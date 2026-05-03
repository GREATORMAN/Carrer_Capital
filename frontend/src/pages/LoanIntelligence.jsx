import React, { useState } from 'react'
import { Building2, CheckCircle2, ExternalLink, Search, Star, X } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components'

const BANKS = [
  { id: 1,  bank: 'SBI',             plan: 'Scholar Loan',      rate: '8.15%',     max: '₹40L',    collateral: 'Collateral-free', type: 'Government',    processing: '15–20 days', recScore: 92 },
  { id: 2,  bank: 'IDFC FIRST',      plan: 'Education Loan',    rate: '8.5%',      max: '₹1Cr',    collateral: 'Collateral-free', type: 'Private',       processing: '5–7 days',   recScore: 94 },
  { id: 3,  bank: 'Bank of Baroda',  plan: 'Baroda Scholar',    rate: '9.7%',      max: '₹80L',    collateral: 'Required >₹7.5L', type: 'Government',    processing: '10–15 days', recScore: 89 },
  { id: 4,  bank: 'ICICI Bank',      plan: 'Education Loan',    rate: '10.5–11.5%',max: '₹1Cr',    collateral: 'Required >₹20L',  type: 'Private',       processing: '5–7 days',   recScore: 85 },
  { id: 5,  bank: 'HDFC Credila',    plan: 'Education Loan',    rate: '11–13%',    max: '₹75L',    collateral: 'Co-applicant',    type: 'NBFC',          processing: '3–5 days',   recScore: 88 },
  { id: 6,  bank: 'Avanse',          plan: 'Financial Services',rate: '11–13%',    max: '₹75L',    collateral: 'Co-applicant',    type: 'NBFC',          processing: '3–5 days',   recScore: 84 },
  { id: 7,  bank: 'Axis Bank',       plan: 'Education Loan',    rate: '13.7%',     max: '₹75L',    collateral: 'Required >₹7.5L', type: 'Private',       processing: '7–10 days',  recScore: 81 },
  { id: 8,  bank: 'InCred',          plan: 'Education Loan',    rate: '12–13.5%',  max: '₹60L',    collateral: 'Co-applicant',    type: 'NBFC',          processing: '3–4 days',   recScore: 80 },
  { id: 9,  bank: 'MPOWER Financing',plan: 'International Loan',rate: '13–15%',    max: '$1,00,000',collateral: 'None (no co-sign)',type: 'International', processing: '5–10 days',  recScore: 95 },
  { id: 10, bank: 'Prodigy Finance', plan: 'International Loan',rate: 'Variable',  max: '$2,20,000',collateral: 'None',            type: 'International', processing: '5–10 days',  recScore: 93 },
]

const TYPE_FILTERS = ['All', 'Government Banks', 'Private Banks', 'NBFCs', 'International', 'Collateral-Free', 'Best Rate']

const formatCurrency = (val) => new Intl.NumberFormat('en-IN').format(Math.round(val))

function calcEMI(principal, rateStr, tenureYears) {
  const rate = parseFloat(rateStr) / 12 / 100
  const n = tenureYears * 12
  if (rate === 0) return principal / n
  return (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
}

export default function LoanIntelligence() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [compareList, setCompareList] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const [loanAmount, setLoanAmount] = useState(3000000)
  const [tenureYears, setTenureYears] = useState(10)

  const filteredBanks = BANKS.filter(b => {
    const matchSearch = b.bank.toLowerCase().includes(search.toLowerCase()) ||
      b.plan.toLowerCase().includes(search.toLowerCase()) ||
      b.type.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Government Banks' && b.type === 'Government') ||
      (activeFilter === 'Private Banks' && b.type === 'Private') ||
      (activeFilter === 'NBFCs' && b.type === 'NBFC') ||
      (activeFilter === 'International' && b.type === 'International') ||
      (activeFilter === 'Collateral-Free' && b.collateral.toLowerCase().includes('free')) ||
      (activeFilter === 'Best Rate' && b.recScore >= 90)
    return matchSearch && matchFilter
  })

  const suggestedBanks = BANKS.filter(b => b.recScore >= 90).sort((a, b) => b.recScore - a.recScore).slice(0, 3)

  const toggleCompare = (bank) => {
    setCompareList(prev => {
      if (prev.find(b => b.id === bank.id)) return prev.filter(b => b.id !== bank.id)
      if (prev.length >= 3) return prev
      return [...prev, bank]
    })
  }

  return (
    <div className="page-shell py-8 pb-32 max-w-6xl">
      <PageHeader
        eyebrow="Loan Intelligence"
        title="Find Your Best Education Loan"
        description="Compare banks, get AI-ranked suggestions, and choose the optimal loan plan for your profile."
      />

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search banks, loan plans, or lenders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:border-[#635bff] focus:ring-1 focus:ring-[#635bff] shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TYPE_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all ${activeFilter === f ? 'bg-[#0a2540] text-white border-[#0a2540]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'}`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 self-center">Showing {filteredBanks.length} of {BANKS.length} lenders</span>
      </div>

      {/* Highly Suggested */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-[#0a2540] dark:text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" /> Highly Suggested for Your Profile
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {suggestedBanks.map(bank => (
            <Card key={`rec-${bank.id}`} hover={false} className="border-t-4 border-t-emerald-500 relative bg-white dark:bg-slate-950 shadow-sm">
              <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Star className="h-2.5 w-2.5 fill-current" /> AI Pick
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center dark:bg-slate-800">
                  <Building2 className="h-5 w-5 text-[#0a2540] dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0a2540] dark:text-white leading-tight">{bank.bank}</h3>
                  <p className="text-xs text-slate-500">{bank.plan}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between"><span className="text-slate-500">Interest Rate</span><span className="font-bold text-teal-600">{bank.rate}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Max Amount</span><span className="font-bold">{bank.max}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Collateral</span><span className="text-slate-700 dark:text-slate-300">{bank.collateral}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Processing</span><span className="text-slate-700 dark:text-slate-300">{bank.processing}</span></div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-[#0a2540] hover:bg-[#173b5c] text-white text-sm">Apply Now</Button>
                <button
                  onClick={() => toggleCompare(bank)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${compareList.find(b => b.id === bank.id) ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'}`}
                >
                  {compareList.find(b => b.id === bank.id) ? <CheckCircle2 className="h-4 w-4" /> : '+ Compare'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="sticky top-4 z-20 mb-8 flex items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 shadow-md dark:border-indigo-900 dark:bg-indigo-950/40">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-indigo-800 dark:text-indigo-300">Comparing: </span>
            {compareList.map(b => <span key={b.id} className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">{b.bank}</span>)}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowCompare(true)}>View Comparison</Button>
            <button onClick={() => setCompareList([])} className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Full Bank Table */}
      <Card hover={false} className="overflow-x-auto shadow-sm border-none">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 font-bold">Bank Name</th>
              <th className="p-4 font-bold">Rate p.a.</th>
              <th className="p-4 font-bold">Max Amount</th>
              <th className="p-4 font-bold">Collateral</th>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Processing</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredBanks.map(bank => (
              <tr key={bank.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-[#0a2540] dark:text-white">{bank.bank}</span>
                    {bank.recScore >= 90 && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400 ml-6">{bank.plan}</p>
                </td>
                <td className="p-4 font-bold text-teal-600">{bank.rate}</td>
                <td className="p-4 font-semibold">{bank.max}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{bank.collateral}</td>
                <td className="p-4"><Badge variant="outline" className="text-xs">{bank.type}</Badge></td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{bank.processing}</td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => toggleCompare(bank)}
                      className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-all ${compareList.find(b => b.id === bank.id) ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'}`}
                    >
                      {compareList.find(b => b.id === bank.id) ? '✓ Added' : '+ Compare'}
                    </button>
                    <Button variant="outline" size="sm" className="text-[#635bff] border-[#635bff] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-xs">
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Comparison Modal */}
      {showCompare && compareList.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setShowCompare(false)}>
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-slate-950 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0a2540] dark:text-white">Loan Plan Comparison</h2>
              <button onClick={() => setShowCompare(false)} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Loan Amount (₹)</label>
                <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 p-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Tenure (Years)</label>
                <input type="number" value={tenureYears} onChange={e => setTenureYears(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 p-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Attribute</th>
                  {compareList.map(b => <th key={b.id} className="p-3 font-bold text-[#0a2540] dark:text-white">{b.bank}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { label: 'Interest Rate', key: 'rate' },
                  { label: 'Max Amount', key: 'max' },
                  { label: 'Collateral', key: 'collateral' },
                  { label: 'Type', key: 'type' },
                  { label: 'Processing Time', key: 'processing' },
                ].map(row => (
                  <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-slate-600">{row.label}</td>
                    {compareList.map(b => <td key={b.id} className="p-3">{b[row.key]}</td>)}
                  </tr>
                ))}
                <tr className="bg-teal-50 dark:bg-teal-900/20">
                  <td className="p-3 font-bold text-teal-700 dark:text-teal-400">Est. Monthly EMI</td>
                  {compareList.map(b => {
                    const rate = parseFloat(b.rate)
                    const emi = isNaN(rate) ? 'Variable' : `₹${formatCurrency(calcEMI(loanAmount, b.rate, tenureYears))}`
                    return <td key={b.id} className="p-3 font-bold text-teal-600">{emi}</td>
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

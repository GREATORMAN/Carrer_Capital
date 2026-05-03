import React, { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { Badge, Button, Card, PageHeader } from '../components'
import { Search, Star, Building2, ExternalLink, Calendar, ArrowLeftRight } from 'lucide-react'

const DEFAULT_BANKS = [
  { id: 1, bank: 'SBI', planName: 'Scholar Loan', providerType: 'Government', interestRate: 8.15, maxAmountLakhs: 40, moratoriumMonths: 12, tenureMonths: 180, collateral: 'No', processing: '15-20 days', recScore: 92 },
  { id: 2, bank: 'HDFC Credila', planName: 'Education Loan', providerType: 'NBFC', interestRate: 11.5, maxAmountLakhs: 75, moratoriumMonths: 6, tenureMonths: 144, collateral: 'Co-applicant', processing: '3-5 days', recScore: 88 },
  { id: 3, bank: 'Axis Bank', planName: 'Education Loan', providerType: 'Private', interestRate: 13.7, maxAmountLakhs: 75, moratoriumMonths: 6, tenureMonths: 180, collateral: 'Yes', processing: '7-10 days', recScore: 81 },
  { id: 4, bank: 'ICICI Bank', planName: 'Education Loan', providerType: 'Private', interestRate: 11.0, maxAmountLakhs: 100, moratoriumMonths: 6, tenureMonths: 144, collateral: 'Yes', processing: '5-7 days', recScore: 85 },
  { id: 5, bank: 'Bank of Baroda', planName: 'Baroda Scholar', providerType: 'Government', interestRate: 9.7, maxAmountLakhs: 80, moratoriumMonths: 12, tenureMonths: 180, collateral: 'Yes', processing: '10-15 days', recScore: 89 },
  { id: 6, bank: 'Avanse', planName: 'Financial Services', providerType: 'NBFC', interestRate: 12.0, maxAmountLakhs: 75, moratoriumMonths: 6, tenureMonths: 144, collateral: 'Co-applicant', processing: '3-5 days', recScore: 84 },
  { id: 7, bank: 'IDFC FIRST', planName: 'Education Loan', providerType: 'Private', interestRate: 8.5, maxAmountLakhs: 100, moratoriumMonths: 6, tenureMonths: 180, collateral: 'No', processing: '5-7 days', recScore: 94 },
  { id: 8, bank: 'InCred', planName: 'Education Loan', providerType: 'NBFC', interestRate: 12.5, maxAmountLakhs: 60, moratoriumMonths: 6, tenureMonths: 120, collateral: 'Co-applicant', processing: '3-4 days', recScore: 80 },
  { id: 9, bank: 'MPOWER Financing', planName: 'International Loan', providerType: 'International', interestRate: 13.0, maxAmountLakhs: 80, moratoriumMonths: 6, tenureMonths: 120, collateral: 'No co-signer', processing: '5-10 days', recScore: 95 },
  { id: 10, bank: 'Prodigy Finance', planName: 'International Loan', providerType: 'International', interestRate: 12.5, maxAmountLakhs: 80, moratoriumMonths: 6, tenureMonths: 120, collateral: 'No collateral', processing: '5-10 days', recScore: 93 },
]

const formatCurrency = (val) => new Intl.NumberFormat('en-IN').format(Math.round(val))
const COLORS = ['#0ea5e9', '#f97316'] // Sky blue and orange

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000)
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenureMonths, setTenureMonths] = useState(120)
  const [extraPayment, setExtraPayment] = useState(0)

  const [cadAmount, setCadAmount] = useState(1000000)
  const [bankSearch, setBankSearch] = useState('')
  const [showAmortization, setShowAmortization] = useState(true)

  const calculateAmortization = () => {
    let balance = Number(loanAmount)
    const monthlyRate = Number(interestRate) / 12 / 100
    const months = Number(tenureMonths)
    let extra = Number(extraPayment) || 0

    let schedule = []
    let emi = (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    if (isNaN(emi) || emi === Infinity) emi = 0
    
    let totalInterest = 0
    
    for (let i = 1; i <= months; i++) {
      if (balance <= 0) break
      const interest = balance * monthlyRate
      let principalPayment = emi - interest + extra
      if (principalPayment > balance) {
        principalPayment = balance
      }
      balance -= principalPayment
      totalInterest += interest
      
      schedule.push({
        month: i,
        emi: emi + extra > balance + interest && balance > 0 ? balance + interest : emi + extra,
        principal: principalPayment,
        interest: interest,
        balance: balance > 0 ? balance : 0,
      })
    }
    return { schedule, totalInterest, emi, actualMonths: schedule.length }
  }

  const { schedule, totalInterest, emi, actualMonths } = useMemo(calculateAmortization, [loanAmount, interestRate, tenureMonths, extraPayment])
  const totalPayment = Number(loanAmount) + totalInterest

  const pieData = [
    { name: 'Principal', value: Number(loanAmount) },
    { name: 'Interest', value: totalInterest }
  ]

  // Data for charts
  const first5Years = schedule.slice(0, 60)
  const every12thMonth = schedule.filter(s => s.month === 1 || s.month % 12 === 0)

  const filteredBanks = DEFAULT_BANKS.filter(b => b.bank.toLowerCase().includes(bankSearch.toLowerCase()) || b.providerType.toLowerCase().includes(bankSearch.toLowerCase()))
  const suggestedBanks = DEFAULT_BANKS.filter(b => b.recScore > 90).slice(0, 3)

  return (
    <div className="page-shell py-8 pb-32 bg-[#e8f4f8] dark:bg-slate-900 min-h-screen">
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* LOAN INPUTS */}
        <Card hover={false} className="border-none shadow-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white mb-6">Loan inputs</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Loan amount (Rs)</label>
              <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-sky-500 font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Interest rate (%)</label>
              <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-sky-500 font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Tenure (Months)</label>
              <input type="number" value={tenureMonths} onChange={e => setTenureMonths(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-sky-500 font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Extra monthly payment (Rs)</label>
              <input type="number" value={extraPayment} onChange={e => setExtraPayment(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-sky-500 font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            </div>
          </div>
        </Card>

        {/* METRICS */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card hover={false} className="border-none shadow-sm rounded-2xl text-center md:text-left flex flex-col justify-center relative overflow-hidden">
            <p className="text-sm font-semibold text-slate-500">Monthly EMI</p>
            <div className="mt-1 flex items-baseline gap-1 md:justify-start justify-center">
              <h3 className="text-3xl font-bold text-[#0a2540] dark:text-white">{formatCurrency(emi)}</h3>
              <span className="text-sm font-bold text-slate-500">Rs</span>
            </div>
            <div className="absolute top-4 right-4 h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 font-serif text-xl dark:bg-sky-900/20">
              $
            </div>
          </Card>
          <Card hover={false} className="border-none shadow-sm rounded-2xl text-center md:text-left flex flex-col justify-center relative overflow-hidden">
            <p className="text-sm font-semibold text-slate-500">Total Interest</p>
            <div className="mt-1 flex items-baseline gap-1 md:justify-start justify-center">
              <h3 className="text-3xl font-bold text-[#0a2540] dark:text-white">{formatCurrency(totalInterest)}</h3>
              <span className="text-sm font-bold text-slate-500">Rs</span>
            </div>
            <p className="text-xs font-semibold text-emerald-500 mt-2">Up over tenure</p>
            <div className="absolute top-4 right-4 h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 dark:bg-slate-800">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
          </Card>
          <Card hover={false} className="border-none shadow-sm rounded-2xl text-center md:text-left flex flex-col justify-center relative overflow-hidden">
            <p className="text-sm font-semibold text-slate-500">Total Payment</p>
            <div className="mt-1 flex items-baseline gap-1 md:justify-start justify-center">
              <h3 className="text-3xl font-bold text-[#0a2540] dark:text-white">{formatCurrency(totalPayment)}</h3>
              <span className="text-sm font-bold text-slate-500">Rs</span>
            </div>
            <div className="absolute top-4 right-4 h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 dark:bg-sky-900/20">
              <Calendar className="h-5 w-5" />
            </div>
          </Card>
          <Card hover={false} className="border-none shadow-sm rounded-2xl text-center md:text-left flex flex-col justify-center relative overflow-hidden">
            <p className="text-sm font-semibold text-slate-500">Loan Duration</p>
            <div className="mt-1 flex items-baseline gap-1 md:justify-start justify-center">
              <h3 className="text-3xl font-bold text-[#0a2540] dark:text-white">{actualMonths}</h3>
              <span className="text-sm font-bold text-slate-500">months</span>
            </div>
            <p className="text-xs font-semibold text-emerald-500 mt-2">Up {(actualMonths/12).toFixed(1)} years</p>
            <div className="absolute top-4 right-4 h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 dark:bg-sky-900/20">
              <Calendar className="h-5 w-5" />
            </div>
          </Card>
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover={false} className="border-none shadow-sm rounded-2xl">
            <h3 className="text-xl font-bold text-[#0a2540] dark:text-white mb-6">Payment breakdown</h3>
            <div className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={100} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `₹${formatCurrency(value)}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-0 left-4 text-[#0ea5e9] text-sm font-semibold">Principal: {formatCurrency(loanAmount)}</div>
              <div className="absolute bottom-0 right-4 text-[#f97316] text-sm font-semibold">Interest: {formatCurrency(totalInterest)}</div>
            </div>
          </Card>
          <Card hover={false} className="border-none shadow-sm rounded-2xl">
            <h3 className="text-xl font-bold text-[#0a2540] dark:text-white mb-6">Repayment schedule: first 5 years</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={first5Years} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{fontSize: 12}} tickMargin={10} minTickGap={10} />
                  <YAxis tick={{fontSize: 12}} />
                  <RechartsTooltip formatter={(value) => `₹${formatCurrency(value)}`} />
                  <Legend />
                  <Bar dataKey="principal" stackId="a" fill="#0ea5e9" name="Principal" />
                  <Bar dataKey="interest" stackId="a" fill="#f97316" name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* CHARTS ROW 2: LINE CHART */}
        <Card hover={false} className="border-none shadow-sm rounded-2xl">
          <h3 className="text-xl font-bold text-[#0a2540] dark:text-white mb-6">Outstanding balance over time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={schedule} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{fontSize: 12}} tickMargin={10} minTickGap={20} />
                <YAxis tick={{fontSize: 12}} domain={[0, 'dataMax']} tickFormatter={(val) => `${val/100000}L`} />
                <RechartsTooltip formatter={(value) => `₹${formatCurrency(value)}`} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={3} dot={false} name="Remaining Balance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ROW 3: TIPS AND CURRENCY CONVERTER */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover={false} className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-950">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-serif text-xl dark:bg-indigo-900/20">$</div>
              <h3 className="text-xl font-bold text-[#0a2540] dark:text-white">Repayment strategy tips</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 ml-13">Small planning moves that usually help students borrow more safely.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
                <h4 className="font-bold text-sm mb-2 text-[#0a2540] dark:text-white">Plan one extra payment during the year</h4>
                <p className="text-xs text-slate-500 leading-relaxed">A single extra payment can help reduce the balance earlier and soften the overall interest burden.</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
                <h4 className="font-bold text-sm mb-2 text-[#0a2540] dark:text-white">Make prepayments earlier if possible</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Early-stage extra payments usually help more because a larger share of the EMI is going toward interest then.</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
                <h4 className="font-bold text-sm mb-2 text-[#0a2540] dark:text-white">Compare shorter tenure against monthly comfort</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Sometimes a slightly higher EMI is worth it if it saves a meaningful amount across the full loan period.</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
                <h4 className="font-bold text-sm mb-2 text-[#0a2540] dark:text-white">Track interest versus principal</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Understanding the split helps you decide when prepayment makes the biggest difference.</p>
              </div>
            </div>
          </Card>
          
          <Card hover={false} className="border-none shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 dark:bg-emerald-900/20"><ArrowLeftRight className="h-5 w-5" /></div>
              <h3 className="text-xl font-bold text-[#0a2540] dark:text-white">Currency converter</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 ml-13">Compare your budget in rupees and destination-country currency.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Country / currency</label>
                <select className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                  <option>Canada (CAD)</option>
                  <option>USA (USD)</option>
                  <option>UK (GBP)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Amount</label>
                <input type="number" value={cadAmount} onChange={e => setCadAmount(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">From Rupees</p>
                  <p className="text-lg font-bold text-[#0a2540] dark:text-white">Rs {formatCurrency(cadAmount)} = C$ {formatCurrency(cadAmount / 61.2)}</p>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">To Rupees</p>
                  <p className="text-lg font-bold text-[#0a2540] dark:text-white">C$ {formatCurrency(cadAmount)} = Rs {formatCurrency(cadAmount * 61.2)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AMORTIZATION TABLE */}
        <Card hover={false} className="border-none shadow-sm rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#0a2540] dark:text-white">Full amortization schedule</h3>
            <Button variant="outline" className="rounded-full bg-[#0a2540] text-white hover:bg-[#173b5c] border-none" onClick={() => setShowAmortization(!showAmortization)}>
              {showAmortization ? 'Hide details' : 'Show details'}
            </Button>
          </div>
          
          {showAmortization && (
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                  <tr>
                    <th className="p-4 font-bold text-[#0a2540] dark:text-white">Month</th>
                    <th className="p-4 font-bold text-[#0a2540] dark:text-white text-right">EMI</th>
                    <th className="p-4 font-bold text-[#0a2540] dark:text-white text-right">Principal</th>
                    <th className="p-4 font-bold text-[#0a2540] dark:text-white text-right">Interest</th>
                    <th className="p-4 font-bold text-[#0a2540] dark:text-white text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {schedule.slice(0, 12).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-4">{row.month}</td>
                      <td className="p-4 text-right">Rs {formatCurrency(row.emi)}</td>
                      <td className="p-4 text-right text-sky-500">Rs {formatCurrency(row.principal)}</td>
                      <td className="p-4 text-right text-orange-500">Rs {formatCurrency(row.interest)}</td>
                      <td className="p-4 text-right font-medium">Rs {formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900">
                      Showing first 12 months. {actualMonths - 12} months remaining...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Link to Loan Intelligence */}
        <div className="pt-8">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 dark:border-indigo-900 dark:from-indigo-950/40 dark:to-sky-950/40">
            <div>
              <h3 className="font-bold text-lg text-[#0a2540] dark:text-white mb-1">Looking to compare bank loan options?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Visit the Loan Intelligence stage to search banks, view AI-ranked lenders, and compare plans side by side.</p>
            </div>
            <a href="/loan-intelligence" className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#0a2540] px-5 py-3 text-sm font-semibold text-white hover:bg-[#173b5c] transition-all">
              Go to Loan Intelligence →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

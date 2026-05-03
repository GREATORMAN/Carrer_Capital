import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bell, BookOpen, CheckCircle2, ChevronDown, Edit, Globe, Lightbulb, MapPin, Search, Target, Trophy, History, Clock } from 'lucide-react'
import { Badge, Button, Card, PageHeader, ProgressBar } from '../components'
import { Link } from 'react-router-dom'

export default function CareerDiscovery() {
  const [step, setStep] = useState(1)
  const [wizardComplete, setWizardComplete] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  const [goal, setGoal] = useState({
    fieldOfStudy: '',
    subField: '',
    targetCountries: [],
    intakeMonth: '',
    intakeYear: '',
    gpa: '',
    workExp: '',
    testScores: { IELTS: '', GRE_Quant: '', GRE_Verbal: '' },
    budgetLakhs: 40,
    fundingSources: [],
    careerRole: '',
    targetSalary: '',
    settleIntent: ''
  })

  const countries = [
    { name: 'Canada', emoji: '🇨🇦', tuition: '₹18–35L/yr', pgwp: '3-year PGWP', living: '₹70K/mo', job: 'Tech & Healthcare' },
    { name: 'United Kingdom', emoji: '🇬🇧', tuition: '₹22–45L/yr', pgwp: '2-year Grad Route', living: '₹90K/mo', job: 'Finance & Law' },
    { name: 'Australia', emoji: '🇦🇺', tuition: '₹20–40L/yr', pgwp: '2–4 years PSW', living: '₹80K/mo', job: 'Engineering & Nursing' },
    { name: 'Germany', emoji: '🇩🇪', tuition: '₹0–5L/yr', pgwp: '18m Job-Seeker', living: '₹60K/mo', job: 'Engineering & Auto' },
    { name: 'USA', emoji: '🇺🇸', tuition: '₹30–80L/yr', pgwp: 'OPT 1–3 years', living: '₹1L/mo', job: 'Tech & Finance' },
  ]

  const nextStep = () => setStep(s => Math.min(s + 1, 7))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const completeWizard = () => {
    setWizardComplete(true)
  }

  const toggleCountry = (c) => {
    setGoal(prev => {
      const isSelected = prev.targetCountries.includes(c)
      if (isSelected) return { ...prev, targetCountries: prev.targetCountries.filter(x => x !== c) }
      if (prev.targetCountries.length >= 3) return prev
      return { ...prev, targetCountries: [...prev.targetCountries, c] }
    })
  }

  const toggleFunding = (f) => {
    setGoal(prev => {
      const isSelected = prev.fundingSources.includes(f)
      if (isSelected) return { ...prev, fundingSources: prev.fundingSources.filter(x => x !== f) }
      return { ...prev, fundingSources: [...prev.fundingSources, f] }
    })
  }

  const updateGoal = (field, value) => {
    setGoal(prev => ({ ...prev, [field]: value }))
  }

  const renderWizardStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">What do you want to study?</h2>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Field of Study</label>
              <select className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-[#635bff] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                value={goal.fieldOfStudy} onChange={e => updateGoal('fieldOfStudy', e.target.value)}>
                <option value="">Select a field...</option>
                <option value="Computer Science & IT">Computer Science & IT</option>
                <option value="Business & MBA">Business & MBA</option>
                <option value="Engineering">Engineering (Mechanical / Civil / Electrical)</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Medicine & Healthcare">Medicine & Healthcare</option>
                <option value="Law">Law</option>
                <option value="Architecture & Design">Architecture & Design</option>
                <option value="Arts & Humanities">Arts & Humanities</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Finance & Economics">Finance & Economics</option>
                <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                <option value="Education">Education</option>
                <option value="Psychology">Psychology</option>
                <option value="Media & Communications">Media & Communications</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Nursing">Nursing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {goal.fieldOfStudy && (
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specific Focus (Sub-field)</label>
                <input type="text" placeholder="e.g. Artificial Intelligence, Marketing..." 
                  className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-[#635bff] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  value={goal.subField} onChange={e => updateGoal('subField', e.target.value)} />
              </div>
            )}
            <div className="bg-sky-50 text-sky-800 p-4 rounded-xl border border-sky-100 flex gap-3 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/50">
              <Lightbulb className="h-5 w-5 shrink-0" />
              <p className="text-sm"><strong>Smart Suggestion:</strong> Students with a B.Tech typically choose: MS in CS · MS in Data Science · MEM</p>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">Where do you want to go?</h2>
            <p className="text-slate-500">Select up to 3 target countries.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map(c => (
                <div key={c.name} onClick={() => toggleCountry(c.name)} className={`cursor-pointer border rounded-2xl p-4 transition-all ${goal.targetCountries.includes(c.name) ? 'border-[#635bff] bg-indigo-50/50 ring-1 ring-[#635bff] dark:bg-indigo-900/20' : 'border-slate-200 hover:border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-950'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-3xl">{c.emoji}</span>
                    {goal.targetCountries.includes(c.name) && <CheckCircle2 className="h-5 w-5 text-[#635bff]" />}
                  </div>
                  <h3 className="font-bold text-[#0a2540] dark:text-white mb-2">{c.name}</h3>
                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <p>🎓 {c.tuition}</p>
                    <p>💼 {c.pgwp}</p>
                    <p>🏠 {c.living}</p>
                  </div>
                </div>
              ))}
              <div className="cursor-pointer border border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900">
                <Globe className="h-6 w-6 text-slate-400 mb-2" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300">Not sure yet?</h3>
                <p className="text-xs text-slate-500 mt-1">Let AI suggest countries for you</p>
              </div>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">When do you want to start?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Jan 2026', 'May 2026', 'Sep 2026', 'Jan 2027', 'Sep 2027', 'Later'].map(intake => (
                <div key={intake} onClick={() => updateGoal('intakeMonth', intake)} className={`cursor-pointer border rounded-2xl p-4 text-center font-bold transition-all ${goal.intakeMonth === intake ? 'border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-500 dark:bg-teal-900/20 dark:text-teal-300' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'}`}>
                  {intake}
                </div>
              ))}
            </div>
            {goal.intakeMonth === 'Sep 2026' && (
              <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/50">
                <p className="text-sm font-bold flex items-center gap-2 mb-2"><Clock className="h-4 w-4"/> You have about 9 months.</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>Months 1–2: Test prep + Profile Enhancement</li>
                  <li>Months 3–4: College Research + Applications</li>
                  <li>Month 5: Scholarship applications</li>
                  <li>Month 6: Visa filing</li>
                </ul>
                <p className="text-xs font-semibold mt-2">Tight but achievable. Let's move fast.</p>
              </div>
            )}
          </motion.div>
        )
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">What is your academic background?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700">Highest Qualification</label>
                <select className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>12th Standard</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Percentage / CGPA</label>
                <input type="text" placeholder="e.g. 8.5" value={goal.gpa} onChange={e => updateGoal('gpa', e.target.value)} className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
                {goal.gpa && <p className="text-xs text-slate-500 mt-1">Equivalent to ~{(parseFloat(goal.gpa)*0.4).toFixed(1)} / 4.0 GPA</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Work Experience</label>
                <select value={goal.workExp} onChange={e => updateGoal('workExp', e.target.value)} className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3+">3+ years</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Backlogs</label>
                <select className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                  <option>None</option>
                  <option>1-2</option>
                  <option>3-5</option>
                </select>
              </div>
            </div>
          </motion.div>
        )
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">Test Scores</h2>
            <p className="text-slate-500 text-sm">Enter your current scores or leave blank if planning to take.</p>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">IELTS</h3>
                  <select className="text-sm border-none bg-slate-50 rounded-md py-1 px-2 dark:bg-slate-900"><option>Have Score</option><option>Planning</option></select>
                </div>
                <input type="number" step="0.5" placeholder="Overall Band (0-9)" value={goal.testScores.IELTS} onChange={e => setGoal(p => ({...p, testScores: {...p.testScores, IELTS: e.target.value}}))} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                {goal.testScores.IELTS >= 7 && <p className="text-xs text-emerald-600 mt-2 font-semibold">✓ Meets entry requirements for 90% of target universities.</p>}
              </div>
              <div className="border border-slate-200 rounded-xl p-4 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">GRE</h3>
                  <select className="text-sm border-none bg-slate-50 rounded-md py-1 px-2 dark:bg-slate-900"><option>Have Score</option><option>Planning</option></select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Quant (130-170)" value={goal.testScores.GRE_Quant} onChange={e => setGoal(p => ({...p, testScores: {...p.testScores, GRE_Quant: e.target.value}}))} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                  <input type="number" placeholder="Verbal (130-170)" value={goal.testScores.GRE_Verbal} onChange={e => setGoal(p => ({...p, testScores: {...p.testScores, GRE_Verbal: e.target.value}}))} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                </div>
                {goal.testScores.GRE_Quant >= 160 && <p className="text-xs text-emerald-600 mt-2 font-semibold">✓ Quant score is in top 20%. Strong for MS programs.</p>}
              </div>
            </div>
            <a href="https://www.ielts.org/for-test-takers/book-a-test" target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#635bff] flex items-center gap-1 hover:underline w-max">
              Find Test Centres Near You <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        )
      case 6:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">Budget & Funding</h2>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Available Budget</label>
                <span className="font-bold text-sky-600">₹{goal.budgetLakhs} Lakhs</span>
              </div>
              <input type="range" min="5" max="200" step="1" value={goal.budgetLakhs} onChange={e => updateGoal('budgetLakhs', Number(e.target.value))} className="w-full accent-sky-500" />
              <p className="text-xs text-slate-500 mt-2">This covers approximately: 1.5 years of tuition in Canada + 12 months living expenses.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">Funding Sources</label>
              <div className="grid grid-cols-2 gap-3">
                {['Family Savings', 'Education Loan', 'Scholarship', 'Part-time Work', 'Assistantship', 'Employer'].map(f => (
                  <label key={f} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer ${goal.fundingSources.includes(f) ? 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800' : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'}`}>
                    <input type="checkbox" checked={goal.fundingSources.includes(f)} onChange={() => toggleFunding(f)} className="accent-[#635bff]" />
                    <span className="text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </div>
            {goal.fundingSources.includes('Education Loan') && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <p className="text-sm font-bold mb-2">Loan Comfort Level</p>
                <input type="range" min="5" max="100" step="1" defaultValue="30" className="w-full accent-amber-500 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">A ₹30L loan at 9% over 10 years = ₹38,000/month EMI.<br/><span className="text-amber-600 font-semibold">Estimated Stress Score: 58 (Moderate 🟡)</span></p>
              </div>
            )}
          </motion.div>
        )
      case 7:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a2540] dark:text-white">Career Goal</h2>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target Role After Graduation</label>
              <input type="text" placeholder="e.g. Data Scientist, Product Manager..." value={goal.careerRole} onChange={e => updateGoal('careerRole', e.target.value)} className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-[#635bff] dark:border-slate-800 dark:bg-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expected Salary (Destination)</label>
              <select value={goal.targetSalary} onChange={e => updateGoal('targetSalary', e.target.value)} className="w-full mt-2 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <option value="">Select range...</option>
                <option>Under $40K</option>
                <option>$40K - $70K</option>
                <option>$70K - $100K</option>
                <option>$100K+</option>
              </select>
              {goal.careerRole && goal.targetSalary && (
                <p className="text-xs text-emerald-600 mt-2 font-medium">Median salary for {goal.careerRole} in Canada: $85,000/year (Source: LinkedIn)</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Long-term Intent</label>
              <div className="flex gap-3">
                {['Settle Abroad', 'Return to India', 'Undecided'].map(intent => (
                  <button key={intent} onClick={() => updateGoal('settleIntent', intent)} className={`flex-1 py-2 px-3 text-sm rounded-xl border font-semibold ${goal.settleIntent === intent ? 'bg-[#0a2540] text-white border-[#0a2540]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'}`}>
                    {intent}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )
      default: return null
    }
  }

  if (wizardComplete && !showCompare) {
    return (
      <div className="page-shell py-8 pb-32 max-w-5xl">
        <PageHeader eyebrow="Stage 01 Complete" title="Your Goal Profile" description="This goal profile will now drive your College Research, Scholarship Matching, and Loan Strategies automatically." />
        
        {/* SECTION B: GOAL SUMMARY CARD */}
        <Card hover={false} className="mb-8 border-t-4 border-[#635bff]">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-[#0a2540] dark:text-white">Primary Goal Summary</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCompare(true)}><Globe className="h-4 w-4 mr-2"/> Compare</Button>
              <Button variant="outline" size="sm" onClick={() => setWizardComplete(false)}><Edit className="h-4 w-4 mr-2"/> Edit</Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Field</span>
              <span className="font-bold">{goal.fieldOfStudy || 'MSc Computer Science'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Countries</span>
              <span className="font-bold">{goal.targetCountries.join(' · ') || 'Canada 🇨🇦'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Intake</span>
              <span className="font-bold">{goal.intakeMonth || 'Sep 2026'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Budget</span>
              <span className="font-bold">₹{goal.budgetLakhs} Lakhs</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Test Status</span>
              <span className="font-bold text-emerald-600">IELTS {goal.testScores.IELTS || '7.0'} ✓</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Career Goal</span>
              <span className="font-bold">{goal.careerRole || 'Data Scientist'}</span>
            </div>
          </div>
          <div className="mt-6 flex gap-4 bg-slate-50 p-4 rounded-xl dark:bg-slate-900/50">
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Stress Score Preview</p>
              <p className="text-lg font-bold text-amber-600 mt-1">58 <span className="text-sm font-medium text-amber-500">(Moderate 🟡)</span></p>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Journey Readiness</p>
              <p className="text-lg font-bold text-emerald-600 mt-1">Stage 01 Complete ✓</p>
            </div>
          </div>
        </Card>

        {/* SECTION C: SMART ALERTS */}
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-amber-500"/> Actionable Alerts Generated</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Card hover={false} className="border-l-4 border-l-sky-500">
            <h4 className="font-bold text-sm">Intake Deadline Countdown</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">Your {goal.intakeMonth || 'Sep 2026'} intake is 9 months away. Most universities open applications in October.</p>
            <Button size="sm" variant="outline" onClick={() => alert('Reminder set successfully! You will be notified 30 days before deadlines.')}>Set Reminder</Button>
          </Card>
          <Card hover={false} className="border-l-4 border-l-amber-500">
            <h4 className="font-bold text-sm">Test Score Optimization</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">Your IELTS {goal.testScores.IELTS || '6.5'} is below the 7.0 required by top target universities. Retake recommended.</p>
            <Button size="sm" variant="outline" onClick={() => alert('Opening IELTS preparation resources in a new tab...')}>View Prep Resources</Button>
          </Card>
        </div>

        {/* SECTION F: READINESS SNAPSHOT */}
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-emerald-500"/> Readiness Snapshot</h3>
        <Card hover={false} className="mb-12">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Academic Profile</span><span className="font-bold">78% Good</span></div>
              <ProgressBar value={78} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Test Scores</span><span className="font-bold text-amber-600">62% Needs attention</span></div>
              <ProgressBar value={62} color="bg-amber-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Budget Coverage</span><span className="font-bold">75% Good</span></div>
              <ProgressBar value={75} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Timeline Feasibility</span><span className="font-bold">88% On track</span></div>
              <ProgressBar value={88} />
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="font-bold text-[#0a2540] dark:text-white">Overall Readiness: 69% — You are in a good position.</p>
            <p className="text-sm text-slate-500 mt-1">Focus area: Improve your test scores to unlock more options.</p>
            <Link to="/admission-planning" className="block w-full mt-4">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Go to Stage 02 — Eligibility Check →</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (showCompare) {
    return (
      <div className="page-shell py-8 pb-32 max-w-5xl">
        <PageHeader eyebrow="Section D" title="Goal Comparison Tool" description="Evaluate different scenarios side-by-side to make the best decision." />
        <Button variant="outline" className="mb-6" onClick={() => setShowCompare(false)}><ArrowLeft className="h-4 w-4 mr-2"/> Back to Summary</Button>
        <Card hover={false} className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-bold text-slate-500">Metric</th>
                <th className="p-4 font-bold text-[#0a2540] dark:text-white">Scenario A (Canada)</th>
                <th className="p-4 font-bold text-[#0a2540] dark:text-white">Scenario B (Germany)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr><td className="p-4 font-medium">Total Cost</td><td className="p-4">₹58L</td><td className="p-4">₹22L</td></tr>
              <tr><td className="p-4 font-medium">Loan Required</td><td className="p-4">₹38L</td><td className="p-4">₹12L</td></tr>
              <tr><td className="p-4 font-medium">Stress Score</td><td className="p-4 text-amber-600 font-bold">61 Moderate 🟡</td><td className="p-4 text-emerald-600 font-bold">32 Low 🟢</td></tr>
              <tr><td className="p-4 font-medium">PR Pathway</td><td className="p-4">Strong (Express Entry)</td><td className="p-4">Moderate (Job Seeker)</td></tr>
              <tr><td className="p-4 font-medium">Avg Starting Salary</td><td className="p-4">$82,000 CAD</td><td className="p-4">€52,000</td></tr>
              <tr><td className="p-4 font-medium">EMI (10 years)</td><td className="p-4">₹42,000/month</td><td className="p-4">₹14,000/month</td></tr>
              <tr><td className="p-4 font-medium">Recommended?</td><td className="p-4 font-bold text-emerald-600">✓ Yes</td><td className="p-4 font-bold text-emerald-600">✓ Yes (budget-wise)</td></tr>
            </tbody>
          </table>
          <div className="p-4 bg-sky-50 text-sky-800 rounded-b-xl border-t border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800">
            <p className="text-sm font-semibold mb-3">AI Summary: Scenario A gives you stronger career outcomes and a clearer PR pathway, but requires 3x the loan. Scenario B is financially safer but limits your earning upside in year 1.</p>
            <div className="flex gap-3">
              <Button size="sm">Set Scenario A</Button>
              <Button variant="outline" size="sm" className="bg-white">Set Scenario B</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // WIZARD UI
  return (
    <div className="page-shell py-8 pb-32 max-w-3xl mx-auto">
      <div className="mb-8">
        <PageHeader eyebrow="Stage 01" title="Goal Setting" description="Define a clear, realistic overseas education goal in under 5 minutes." />
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Step {step} of 7</span>
          <span>{Math.round((step/7)*100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-800">
          <div className="h-full bg-gradient-to-r from-[#635bff] to-[#00d4ff] transition-all duration-300" style={{width: `${(step/7)*100}%`}}></div>
        </div>
      </div>

      <Card hover={false} className="min-h-[400px] flex flex-col justify-between">
        {renderWizardStep()}
        
        <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-6 dark:border-slate-800">
          <Button variant="outline" disabled={step === 1} onClick={prevStep}><ArrowLeft className="h-4 w-4 mr-2"/> Back</Button>
          {step < 7 ? (
            <Button className="bg-[#0a2540] hover:bg-[#173b5c] text-white" onClick={nextStep}>Next Step <ArrowRight className="h-4 w-4 ml-2"/></Button>
          ) : (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={completeWizard}>Save & Generate Plan <CheckCircle2 className="h-4 w-4 ml-2"/></Button>
          )}
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md lg:left-[300px] dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="font-bold text-[#0a2540] dark:text-white">Your next best action: </span>
            {step === 7 ? "Complete your goal profile to unlock your personalized plan." : "Continue filling out your basic information."}
          </p>
          <Button size="sm" onClick={step === 7 ? completeWizard : nextStep} className="rounded-full bg-[#0a2540] text-white hover:bg-[#173b5c]">
            {step === 7 ? "Save Profile" : "Continue"} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

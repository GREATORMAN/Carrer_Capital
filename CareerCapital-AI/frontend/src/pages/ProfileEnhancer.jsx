import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Landmark,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react'
import { Badge, Button, Card, InputField, PageHeader, ProgressBar } from '../components'
import { userService } from '../services/api'
import { filterAndRankColleges } from '../utils/collegeSearch'
import { colleges } from '../data/colleges'

const defaultProfile = {
  personal_info: {
    name: '',
    age: '',
    country: '',
    preferred_study_destination: '',
  },
  academics: {
    qualification: 'UG',
    gpa: '',
    major: '',
    backlogs: '',
  },
  experience: {
    work_experience: '',
    internships: '',
    skills: '',
  },
  preferences: {
    target_level: 'PG',
    field_of_interest: 'Computer Science',
    budget_range: 35,
    preferred_countries: '',
  },
  test_scores: {
    ielts: '',
    toefl: '',
    gre: '',
    gmat: '',
    others: '',
  },
  autofill_source: '',
}

const defaultDocuments = [
  { doc_type: 'Resume / CV', status: 'missing', feedback: 'Upload your latest resume to unlock skill mapping.', file_name: '', file_url: '' },
  { doc_type: 'Statement of Purpose', status: 'needs_improvement', feedback: 'Career goals need clearer storytelling and outcomes.', file_name: '', file_url: '' },
  { doc_type: 'Academic Transcripts', status: 'missing', feedback: 'Add transcripts to calculate academic fit and loan planning.', file_name: '', file_url: '' },
  { doc_type: 'Passport', status: 'missing', feedback: 'Passport copy helps with application readiness tracking.', file_name: '', file_url: '' },
  { doc_type: 'IELTS / GRE Scorecard', status: 'missing', feedback: 'Scores are needed for stronger admission probability estimates.', file_name: '', file_url: '' },
  { doc_type: 'Recommendation Letters', status: 'needs_improvement', feedback: 'Target recommenders who can describe measurable impact.', file_name: '', file_url: '' },
  { doc_type: 'Financial Documents', status: 'missing', feedback: 'Bank statements improve loan and affordability planning.', file_name: '', file_url: '' },
]

const stepConfig = [
  { id: 1, key: 'personal_info', label: 'Personal', icon: UserRound },
  { id: 2, key: 'academics', label: 'Academics', icon: GraduationCap },
  { id: 3, key: 'experience', label: 'Experience', icon: Sparkles },
  { id: 4, key: 'preferences', label: 'Preferences', icon: Landmark },
  { id: 5, key: 'test_scores', label: 'Scores', icon: FileText },
]

export default function ProfileEnhancer() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState(defaultProfile)
  const [documents, setDocuments] = useState(defaultDocuments)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const { data } = await userService.getProfileCenter()
        if (!mounted) return
        if (data.profile) {
          setProfile({
            ...defaultProfile,
            ...data.profile,
            personal_info: { ...defaultProfile.personal_info, ...data.profile.personal_info },
            academics: { ...defaultProfile.academics, ...data.profile.academics },
            experience: { ...defaultProfile.experience, ...data.profile.experience },
            preferences: { ...defaultProfile.preferences, ...data.profile.preferences },
            test_scores: { ...defaultProfile.test_scores, ...data.profile.test_scores },
          })
        }
        if (data.documents?.length) {
          setDocuments(defaultDocuments.map((doc) => data.documents.find((item) => item.doc_type === doc.doc_type) || doc))
        }
      } catch {
        // Keep local defaults when backend data is unavailable.
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const completion = calculateProfileCompletion(profile, documents)
  const alerts = buildAlerts(profile, documents)
  const recommended = filterAndRankColleges(
    colleges,
    `${profile.preferences.preferred_countries} ${profile.preferences.field_of_interest} ${profile.preferences.target_level}`,
    {
      country: 'All',
      courseType: 'All',
      field: 'All',
      maxBudget: Number(profile.preferences.budget_range || 70),
      ieltsRequired: 'Any',
      greRequired: 'Any',
      universityType: 'All',
      scholarship: 'Any',
    }
  ).slice(0, 3)

  const updateSection = (section, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const persistProfile = async (nextProfile = profile) => {
    setSaving(true)
    try {
      await userService.updateProfileCenter(nextProfile)
      await userService.syncAlerts().catch(() => {})
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (docType, file) => {
    const feedback = getMockFeedback(docType)
    const status = feedback.includes('strong') ? 'uploaded' : 'needs_improvement'
    const fileUrl = URL.createObjectURL(file)
    const nextDocument = {
      doc_type: docType,
      file_name: file.name,
      file_url: fileUrl,
      status,
      feedback,
    }
    setDocuments((prev) => prev.map((doc) => (doc.doc_type === docType ? { ...doc, ...nextDocument } : doc)))
    try {
      await userService.saveDocument(nextDocument)
      await userService.syncAlerts().catch(() => {})
    } catch {
      // Keep local UI state if mock backend is unavailable.
    }

    if (docType === 'Resume / CV') {
      const autofillProfile = {
        ...profile,
        experience: {
          ...profile.experience,
          skills: profile.experience.skills || 'Python, SQL, Data Analysis, Research',
          internships: profile.experience.internships || '1 internship inferred from resume upload',
        },
        autofill_source: file.name,
      }
      setProfile(autofillProfile)
      await persistProfile(autofillProfile)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-10">
        <div className="page-shell">
          <Card hover={false}>Loading profile workspace...</Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen soft-grid py-10 pb-24">
      <div className="page-shell">
        <PageHeader
          eyebrow="Profile enhancement"
          title="Improve personal details, SOP strength, and document readiness."
          description="Build the student profile, review suggestions, audit SOP and resume quality, and upload documents for admission readiness."
        />

        <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card hover={false}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#635bff]">Profile strength</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#0a2540] dark:text-white">{completion.total}%</h2>
              </div>
              <Badge variant={completion.total >= 75 ? 'success' : 'warning'}>
                {completion.total >= 75 ? 'Strong profile' : 'Needs improvement'}
              </Badge>
            </div>
            <ProgressBar value={completion.total} max={100} animated={false} />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MetricChip label="Academics" value={completion.academics} />
              <MetricChip label="Documents" value={completion.documents} />
              <MetricChip label="Scores" value={completion.scores} />
            </div>
            {profile.autofill_source && (
              <div className="mt-5 rounded-2xl border border-[#635bff]/15 bg-[#635bff]/[0.06] p-4 text-sm text-slate-700 dark:text-slate-200">
                Resume autofill applied from `{profile.autofill_source}`. Review skills and internship fields before submitting.
              </div>
            )}
          </Card>

          <Card hover={false}>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#0a2540] dark:text-white">Suggestions and SOP audits</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">{alert}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <Card hover={false}>
            <div className="mb-6 flex flex-wrap gap-2">
              {stepConfig.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setStep(item.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${step === item.id ? 'bg-[#0a2540] text-white' : 'bg-white/70 text-slate-600 ring-1 ring-slate-200 hover:bg-white dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <StepBody step={step} profile={profile} updateSection={updateSection} />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-6 dark:border-slate-800">
              <Button variant="secondary" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}>
                Back
              </Button>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => persistProfile()}>
                  {saving ? 'Saving...' : 'Save & continue'}
                </Button>
                <Button onClick={() => setStep((value) => Math.min(stepConfig.length, value + 1))}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-8">
            <Card hover={false}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-[#0a2540] dark:text-white">Document center</h2>
                <Badge>{documents.filter((doc) => doc.status === 'uploaded').length}/{documents.length} uploaded</Badge>
              </div>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <DocumentItem key={doc.doc_type} doc={doc} onUpload={handleUpload} />
                ))}
              </div>
            </Card>

            <Card hover={false}>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#0a2540] dark:text-white">Best matches based on your profile</h2>
              <div className="space-y-3">
                {recommended.map((college) => (
                  <div key={college.id} className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{college.university}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{college.course}</p>
                      </div>
                      <Badge variant="success">{college.admissionProbability}% chance</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>Total cost: Rs {college.feesLakhs + college.livingLakhs}L</span>
                      <span>ROI: {college.roi}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepBody({ step, profile, updateSection }) {
  const current = stepConfig.find((item) => item.id === step)
  switch (current?.key) {
    case 'personal_info':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Name" value={profile.personal_info.name} onChange={(e) => updateSection('personal_info', 'name', e.target.value)} />
          <InputField label="Age" type="number" value={profile.personal_info.age} onChange={(e) => updateSection('personal_info', 'age', e.target.value)} />
          <InputField label="Country" value={profile.personal_info.country} onChange={(e) => updateSection('personal_info', 'country', e.target.value)} />
          <InputField label="Preferred study destination" value={profile.personal_info.preferred_study_destination} onChange={(e) => updateSection('personal_info', 'preferred_study_destination', e.target.value)} />
        </div>
      )
    case 'academics':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Current qualification" value={profile.academics.qualification} onChange={(e) => updateSection('academics', 'qualification', e.target.value)} options={['12th', 'UG', 'PG']} />
          <InputField label="GPA / Percentage" value={profile.academics.gpa} onChange={(e) => updateSection('academics', 'gpa', e.target.value)} />
          <InputField label="Major / Field" value={profile.academics.major} onChange={(e) => updateSection('academics', 'major', e.target.value)} />
          <InputField label="Backlogs" value={profile.academics.backlogs} onChange={(e) => updateSection('academics', 'backlogs', e.target.value)} />
        </div>
      )
    case 'experience':
      return (
        <div className="grid gap-4">
          <InputField label="Work experience" value={profile.experience.work_experience} onChange={(e) => updateSection('experience', 'work_experience', e.target.value)} />
          <InputField label="Internships" value={profile.experience.internships} onChange={(e) => updateSection('experience', 'internships', e.target.value)} />
          <TextAreaField label="Skills" value={profile.experience.skills} onChange={(e) => updateSection('experience', 'skills', e.target.value)} />
        </div>
      )
    case 'preferences':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Study level" value={profile.preferences.target_level} onChange={(e) => updateSection('preferences', 'target_level', e.target.value)} options={['UG', 'PG', 'PGD', 'PhD']} />
          <SelectField label="Field of interest" value={profile.preferences.field_of_interest} onChange={(e) => updateSection('preferences', 'field_of_interest', e.target.value)} options={['Computer Science', 'Business', 'Bioinformatics', 'Engineering']} />
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Budget range: Rs {profile.preferences.budget_range}L</label>
            <input type="range" min="10" max="70" value={profile.preferences.budget_range} onChange={(e) => updateSection('preferences', 'budget_range', e.target.value)} className="w-full" />
          </div>
          <TextAreaField label="Preferred countries" value={profile.preferences.preferred_countries} onChange={(e) => updateSection('preferences', 'preferred_countries', e.target.value)} placeholder="Canada, Germany, Netherlands" />
        </div>
      )
    default:
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="IELTS" value={profile.test_scores.ielts} onChange={(e) => updateSection('test_scores', 'ielts', e.target.value)} />
          <InputField label="TOEFL" value={profile.test_scores.toefl} onChange={(e) => updateSection('test_scores', 'toefl', e.target.value)} />
          <InputField label="GRE" value={profile.test_scores.gre} onChange={(e) => updateSection('test_scores', 'gre', e.target.value)} />
          <InputField label="GMAT" value={profile.test_scores.gmat} onChange={(e) => updateSection('test_scores', 'gmat', e.target.value)} />
          <TextAreaField label="Other scores" value={profile.test_scores.others} onChange={(e) => updateSection('test_scores', 'others', e.target.value)} />
        </div>
      )
  }
}

function DocumentItem({ doc, onUpload }) {
  const statusMeta = {
    uploaded: { label: 'Uploaded', variant: 'success', icon: CheckCircle2 },
    missing: { label: 'Missing', variant: 'warning', icon: AlertTriangle },
    needs_improvement: { label: 'Needs Improvement', variant: 'warning', icon: Sparkles },
  }
  const meta = statusMeta[doc.status]
  const StatusIcon = meta.icon

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#635bff]/10 p-2 text-[#635bff]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{doc.doc_type}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={meta.variant}><StatusIcon className="mr-1 h-3.5 w-3.5" />{meta.label}</Badge>
              {doc.file_name && <span className="text-xs text-slate-500">{doc.file_name}</span>}
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{doc.feedback}</p>
            {doc.file_url && (
              <a href={doc.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-[#635bff]">
                Preview / download
              </a>
            )}
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0a2540] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173b5c]">
          <Upload className="h-4 w-4" />
          Upload
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onUpload(doc.doc_type, file)
            }}
          />
        </label>
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <select value={value} onChange={onChange} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function TextAreaField({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900" />
    </label>
  )
}

function MetricChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}%</p>
    </div>
  )
}

function calculateProfileCompletion(profile, documents) {
  const academicsFields = ['qualification', 'gpa', 'major']
  const scoresFields = ['ielts', 'toefl', 'gre', 'gmat', 'others']
  const academics = Math.round((academicsFields.filter((field) => String(profile.academics[field] || '').trim()).length / academicsFields.length) * 100)
  const documentsScore = Math.round((documents.reduce((sum, doc) => sum + (doc.status === 'uploaded' ? 1 : doc.status === 'needs_improvement' ? 0.6 : 0), 0) / documents.length) * 100)
  const scores = Math.round((scoresFields.filter((field) => String(profile.test_scores[field] || '').trim()).length / 2) * 100)
  const total = Math.round(academics * 0.35 + documentsScore * 0.4 + Math.min(scores, 100) * 0.25)
  return { academics, documents: documentsScore, scores: Math.min(scores, 100), total }
}

function buildAlerts(profile, documents) {
  const alerts = []
  if (!documents.find((doc) => doc.doc_type === 'Statement of Purpose')?.file_name) alerts.push('Upload your SOP to improve college recommendation quality.')
  if (!String(profile.test_scores.gre || '').trim()) alerts.push('Adding GRE can improve admission probability for selective programs.')
  if (Number(profile.preferences.budget_range) < 25) alerts.push('Lower budgets benefit from scholarship-first and public university targeting.')
  if (!String(profile.personal_info.preferred_study_destination || '').trim()) alerts.push('Choose a preferred destination to sharpen country-specific matches.')
  return alerts.slice(0, 4)
}

function getMockFeedback(docType) {
  const feedback = {
    'Resume / CV': 'Resume looks strong. Add more project-based achievements and measurable outcomes.',
    'Statement of Purpose': 'Your SOP lacks clarity in long-term career goals and why this program fits.',
    'Academic Transcripts': 'Transcripts uploaded. Academics are strong enough for shortlist matching.',
    Passport: 'Passport uploaded. Good for application readiness tracking.',
    'IELTS / GRE Scorecard': 'Scorecard uploaded. This improves admission probability estimates.',
    'Recommendation Letters': 'Letters uploaded. Make sure at least one letter highlights research or technical impact.',
    'Financial Documents': 'Financial documents uploaded. Loan and affordability scoring can now be refined.',
  }
  return feedback[docType] || 'Document uploaded and ready for AI review.'
}

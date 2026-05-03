export const journeyStages = [
  { number: '01', label: 'Career Discovery',    detail: 'Define career goals, target country, course, and study timeline.', href: '/career-discovery' },
  { number: '02', label: 'Admission Planning',  detail: 'Map academic profile against target programmes; build application plan.', href: '/admission-planning' },
  { number: '03', label: 'Profile Enhancement', detail: 'Identify and close profile gaps — SOP, scores, recommendations.', href: '/profile-enhancer' },
  { number: '04', label: 'Cost & ROI Planning', detail: 'Model total cost, scholarship impact, and projected return on investment.', href: '/college-finder' },
  { number: '05', label: 'Loan Intelligence',   detail: 'Understand loan options, compare banks, and choose optimal plan.', href: '/loan-intelligence' },
  { number: '06', label: 'Smart Repayment',     detail: 'Build a smart repayment strategy using advanced EMI modelling.', href: '/emi-calculator' },
  { number: '07', label: 'Visa & Risk',         detail: 'Track visa requirements, assess risk factors, and prepare documents.', href: '/visa-predictor' },
  { number: '08', label: 'Mentorship',          detail: 'Connect with mentors, alumni, and counsellors for guided support.', href: '/mentorship' },
  { number: '09', label: 'Smart Living',        detail: 'Plan accommodation, insurance, forex, and pre-departure logistics.', href: '/living-assistant' },
  { number: '10', label: 'Progress Tracking',   detail: 'Monitor career outcomes, EMI repayment, and measure study-abroad ROI.', href: '/progress' },
]

export function getCurrentStage(pathname) {
  return journeyStages.find((item) => pathname.startsWith(item.href)) || journeyStages[0]
}

export function getAcademicStrength(profile) {
  if (!profile) return 40
  const fields = ['qualification', 'gpa', 'major']
  return Math.round((fields.filter((field) => String(profile.academics?.[field] || '').trim()).length / fields.length) * 100)
}

export function getDocumentStrength(documents) {
  if (!documents.length) return 34
  return Math.round((documents.reduce((sum, doc) => sum + (doc.status === 'uploaded' ? 1 : doc.status === 'needs_improvement' ? 0.6 : 0), 0) / documents.length) * 100)
}

export function getScoreStrength(profile) {
  if (!profile) return 24
  const fields = ['ielts', 'toefl', 'gre', 'gmat', 'others']
  return Math.min(100, Math.round((fields.filter((field) => String(profile.test_scores?.[field] || '').trim()).length / 2) * 100))
}

export function getProfileStrength(profile, documents) {
  const academics = getAcademicStrength(profile)
  const docs = getDocumentStrength(documents)
  const scores = getScoreStrength(profile)
  return Math.round(academics * 0.35 + docs * 0.4 + scores * 0.25)
}

export function getProfileGaps(profile, documents) {
  const gaps = []
  if (!profile?.personal_info?.name) gaps.push('Add personal details')
  if (!profile?.academics?.gpa) gaps.push('Add GPA or percentage')
  if (!profile?.preferences?.field_of_interest) gaps.push('Select field of interest')
  if (!String(profile?.test_scores?.ielts || profile?.test_scores?.toefl || '').trim()) gaps.push('Add English test score')
  const missingDocuments = documents.filter((doc) => doc.status === 'missing').map((doc) => doc.doc_type)
  if (missingDocuments.length) gaps.push(`${missingDocuments.length} document${missingDocuments.length > 1 ? 's' : ''} missing`)
  return gaps
}

export function getSmartSuggestion(profile, documents, pathname = '/dashboard') {
  const stage = getCurrentStage(pathname)
  const gaps = getProfileGaps(profile, documents)
  if (gaps.length) {
    return `Before pushing ${stage.label.toLowerCase()}, fix this first: ${gaps[0]}.`
  }
  if (!documents.some((doc) => doc.doc_type === 'Statement of Purpose' && doc.status === 'uploaded')) {
    return 'Your profile is strong enough to shortlist programs, but SOP quality is still limiting admit confidence.'
  }
  if (!String(profile?.test_scores?.gre || '').trim() && profile?.preferences?.target_level === 'PG') {
    return 'You can unlock stronger PG program matches by adding GRE where selective programs expect it.'
  }
  return `You are in ${stage.label}. Move next on scholarships, applications, or repayment depending on your shortlist maturity.`
}

function isoDatePlus(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function buildWorkspaceAlerts(profile, documents, savedColleges = []) {
  const alerts = []
  const profileStrength = getProfileStrength(profile, documents)
  const missingDocs = documents.filter((doc) => doc.status === 'missing')

  if (profileStrength < 80) {
    alerts.push({
      id: 'profile-completion',
      type: 'Document Missing',
      title: 'Profile is still below decision-ready strength',
      detail: `${profileStrength}% complete. Finish the next missing item before shortlisting more colleges.`,
      dueDate: isoDatePlus(2),
      severity: 'high',
    })
  }

  if (missingDocs.length) {
    alerts.push({
      id: 'missing-docs',
      type: 'Document Missing',
      title: 'Missing documents are blocking application readiness',
      detail: `Upload ${missingDocs.slice(0, 2).map((doc) => doc.doc_type).join(' and ')} to improve admit and visa guidance.`,
      dueDate: isoDatePlus(4),
      severity: 'high',
    })
  }

  alerts.push({
    id: 'scholarship-deadline',
    type: 'Scholarship Deadline',
    title: 'Scholarship review window is approaching',
    detail: 'Top funding matches should be reviewed before the next intake deadline closes.',
    dueDate: isoDatePlus(9),
    severity: 'medium',
  })

  alerts.push({
    id: 'exam-booking',
    type: 'Exam Date',
    title: 'Book your IELTS or TOEFL slot',
    detail: 'Reserve an exam date early enough for score reporting before university cutoffs.',
    dueDate: isoDatePlus(12),
    severity: 'medium',
  })

  alerts.push({
    id: 'registration',
    type: 'Registration',
    title: 'Complete passport and testing registrations',
    detail: 'Final-stage application and visa prep moves faster once identity and test registrations are locked.',
    dueDate: isoDatePlus(15),
    severity: 'low',
  })

  if (savedColleges.length) {
    alerts.push({
      id: 'saved-colleges',
      type: 'College Opening',
      title: `${savedColleges[0].university} is a strong active target`,
      detail: `Keep ${savedColleges[0].course} warm in your shortlist and align documents to its application cycle.`,
      dueDate: isoDatePlus(6),
      severity: 'medium',
    })
  }

  return alerts.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export function getAlertGroups(profile, documents, savedColleges = []) {
  const alerts = buildWorkspaceAlerts(profile, documents, savedColleges)
  const groups = [
    'College Opening',
    'Scholarship Deadline',
    'Exam Date',
    'Registration',
    'Document Missing',
  ]

  return groups.map((type) => ({
    title: type,
    items: alerts.filter((alert) => alert.type === type),
  })).filter((group) => group.items.length)
}

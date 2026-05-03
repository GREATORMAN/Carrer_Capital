export const journeyStages = [
  { number: '01', label: 'Career Discovery', href: '/career-discovery' },
  { number: '02', label: 'Admission Planning', href: '/profile-enhancer' },
  { number: '03', label: 'Profile Enhancement', href: '/profile-enhancer' },
  { number: '04', label: 'Cost & ROI Planning', href: '/college-finder' },
  { number: '05', label: 'Loan Intelligence', href: '/dashboard' },
  { number: '06', label: 'Smart Repayment', href: '/emi-calculator' },
  { number: '07', label: 'Visa & Risk Assessment', href: '/visa-predictor' },
  { number: '08', label: 'Mentorship Ecosystem', href: '/mentorship' },
  { number: '09', label: 'Smart Living Assistant', href: '/living-assistant' },
  { number: '10', label: 'Progress Tracking', href: '/progress' },
]

function isoDatePlus(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
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
  const missingDocuments = documents.filter((doc) => doc.status === 'missing')
  if (missingDocuments.length) gaps.push(`${missingDocuments.length} document${missingDocuments.length > 1 ? 's' : ''} missing`)
  return gaps
}

export function getCurrentStage(profile, documents, shortlist = []) {
  const strength = getProfileStrength(profile, documents)
  if (strength < 45) return journeyStages[0]
  if (strength < 70) return journeyStages[2]
  if (!shortlist.length) return journeyStages[3]
  if (shortlist.some((item) => item.applicationStatus === 'applied')) return journeyStages[6]
  return journeyStages[5]
}

export function buildPersistentAlerts(profile, documents, shortlist = []) {
  const alerts = []
  const profileStrength = getProfileStrength(profile, documents)
  const missingDocs = documents.filter((doc) => doc.status === 'missing')

  if (profileStrength < 80) {
    alerts.push({
      id: 'profile-completion',
      type: 'Document Missing',
      title: 'Profile is below decision-ready strength',
      detail: `${profileStrength}% complete. Finish the next missing item before expanding your shortlist.`,
      dueDate: isoDatePlus(2),
      severity: 'high',
    })
  }

  if (missingDocs.length) {
    alerts.push({
      id: 'missing-documents',
      type: 'Document Missing',
      title: 'Missing documents are blocking admission confidence',
      detail: `Upload ${missingDocs.slice(0, 2).map((doc) => doc.doc_type).join(' and ')} to improve recommendation accuracy.`,
      dueDate: isoDatePlus(4),
      severity: 'high',
    })
  }

  alerts.push({
    id: 'scholarship-window',
    type: 'Scholarship Deadline',
    title: 'Scholarship review window is approaching',
    detail: 'Review current scholarship-aligned programs before the next intake deadline closes.',
    dueDate: isoDatePlus(9),
    severity: 'medium',
  })

  alerts.push({
    id: 'exam-booking',
    type: 'Exam Date',
    title: 'Book your IELTS or TOEFL slot',
    detail: 'Reserve your exam date early enough for score reporting before university cutoffs.',
    dueDate: isoDatePlus(11),
    severity: 'medium',
  })

  alerts.push({
    id: 'identity-registration',
    type: 'Registration',
    title: 'Complete testing and passport registrations',
    detail: 'Identity and exam registrations should be settled before application and visa-stage requests arrive.',
    dueDate: isoDatePlus(13),
    severity: 'low',
  })

  shortlist.slice(0, 2).forEach((item, index) => {
    alerts.push({
      id: `shortlist-${item.collegeId}`,
      type: 'College Opening',
      title: `${item.university || 'Shortlisted college'} needs status review`,
      detail: `Current application status is ${item.applicationStatus || 'saved'}. Keep deadlines and document quality aligned.`,
      dueDate: isoDatePlus(6 + index),
      severity: 'medium',
    })
  })

  return alerts.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

import { calculateEMI } from './financial'

const normalize = (value) => String(value || '').toLowerCase()

export const defaultCollegeFilters = {
  country: 'All',
  courseType: 'All',
  field: 'All',
  maxBudget: 70,
  ieltsRequired: 'Any',
  greRequired: 'Any',
  universityType: 'All',
  scholarship: 'Any',
}

export const getTotalCost = (college) => college.feesLakhs + college.livingLakhs

export const getLoanRequired = (college, savingsLakhs = 10) => Math.max(0, getTotalCost(college) - savingsLakhs)

export const getEmiEstimate = (college) => calculateEMI(getLoanRequired(college) * 100000, 9.5, 120)

export const getSmartIntent = (query) => {
  const q = normalize(query)
  return {
    highSalary: /salary|pay|package|roi|return|earning/.test(q),
    lowBudget: /under|below|cheap|affordable|budget|low cost/.test(q),
    noGre: /no gre|without gre|gre not/.test(q),
    scholarship: /scholarship|funding|aid/.test(q),
    publicUniversity: /public|government/.test(q),
  }
}

export const scoreCollege = (college, query) => {
  const q = normalize(query)
  const haystack = normalize(`${college.university} ${college.country} ${college.city} ${college.course} ${college.field} ${college.courseType}`)
  const intent = getSmartIntent(query)
  let score = 0

  if (!q) score += 10
  if (q && haystack.includes(q)) score += 60
  q.split(/\s+/).filter(Boolean).forEach((token) => {
    if (haystack.includes(token)) score += 8
  })
  if (intent.highSalary) score += college.roiScore / 3 + college.salaryLakhs / 3
  if (intent.lowBudget) score += Math.max(0, 75 - getTotalCost(college))
  if (intent.noGre && !college.greRequired) score += 18
  if (intent.scholarship && college.scholarship) score += 16
  if (intent.publicUniversity && college.universityType === 'Public') score += 12

  score += college.admissionProbability / 5
  score += college.roiScore / 8
  score -= college.ranking / 120
  return Math.round(score)
}

export const filterAndRankColleges = (colleges, query, filters = defaultCollegeFilters) => {
  return colleges
    .filter((college) => {
      const totalCost = getTotalCost(college)
      if (filters.country !== 'All' && college.country !== filters.country) return false
      if (filters.courseType !== 'All' && college.courseType !== filters.courseType) return false
      if (filters.field !== 'All' && college.field !== filters.field) return false
      if (totalCost > Number(filters.maxBudget)) return false
      if (filters.ieltsRequired !== 'Any' && college.ieltsRequired !== (filters.ieltsRequired === 'Required')) return false
      if (filters.greRequired !== 'Any' && college.greRequired !== (filters.greRequired === 'Required')) return false
      if (filters.universityType !== 'All' && college.universityType !== filters.universityType) return false
      if (filters.scholarship !== 'Any' && college.scholarship !== (filters.scholarship === 'Available')) return false
      return true
    })
    .map((college) => ({ ...college, decisionScore: scoreCollege(college, query) }))
    .sort((a, b) => b.decisionScore - a.decisionScore)
}

export const getRecommendationReason = (college) => {
  const reasons = []
  if (college.roiScore >= 88) reasons.push('strong ROI')
  if (college.admissionProbability >= 75) reasons.push('solid admission fit')
  if (getTotalCost(college) <= 40) reasons.push('efficient total cost')
  if (college.scholarship) reasons.push('scholarship options')
  return reasons.slice(0, 2).join(' and ') || 'balanced profile fit'
}

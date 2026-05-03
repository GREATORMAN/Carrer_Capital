export const bankLoanPlans = [
  {
    id: 'sbi-global-ed-vantage',
    bank: 'State Bank of India',
    providerType: 'Public Bank',
    planName: 'Global Ed-Vantage',
    interestRate: 9.15,
    maxAmountLakhs: 150,
    marginPercent: 10,
    moratoriumMonths: 18,
    tenureMonths: 180,
    collateral: 'Required above selected threshold',
    processingFeePercent: 1,
    highlights: ['Wide study abroad coverage', 'Long repayment window', 'Stable public-bank pricing'],
    officialLink: 'https://sbi.co.in/web/personal-banking/loans/education-loans/global-ed-vantage-scheme',
  },
  {
    id: 'hdfc-credila-student',
    bank: 'HDFC Credila',
    providerType: 'NBFC',
    planName: 'Student Premium Loan',
    interestRate: 10.25,
    maxAmountLakhs: 120,
    marginPercent: 5,
    moratoriumMonths: 12,
    tenureMonths: 180,
    collateral: 'Flexible case-based collateral',
    processingFeePercent: 1.25,
    highlights: ['Fast sanctions', 'Strong overseas specialization', 'Flexible collateral review'],
    officialLink: 'https://www.credila.com',
  },
  {
    id: 'axis-education-power',
    bank: 'Axis Bank',
    providerType: 'Private Bank',
    planName: 'Education Power Plan',
    interestRate: 9.75,
    maxAmountLakhs: 95,
    marginPercent: 10,
    moratoriumMonths: 12,
    tenureMonths: 144,
    collateral: 'Secured plan for higher amounts',
    processingFeePercent: 1,
    highlights: ['Competitive EMI range', 'Structured onboarding', 'Good for medium-ticket loans'],
    officialLink: 'https://www.axisbank.com/retail/loans/education-loan',
  },
  {
    id: 'icici-study-abroad',
    bank: 'ICICI Bank',
    providerType: 'Private Bank',
    planName: 'Study Abroad Loan',
    interestRate: 10.1,
    maxAmountLakhs: 125,
    marginPercent: 15,
    moratoriumMonths: 12,
    tenureMonths: 120,
    collateral: 'Collateral for larger sanctioned amounts',
    processingFeePercent: 1,
    highlights: ['Strong branch network', 'Simple digital servicing', 'Works well for co-borrower-backed cases'],
    officialLink: 'https://www.icicibank.com/personal-banking/loans/education-loan',
  },
  {
    id: 'avanse-abroad-flex',
    bank: 'Avanse',
    providerType: 'NBFC',
    planName: 'Abroad Flex Loan',
    interestRate: 11.35,
    maxAmountLakhs: 100,
    marginPercent: 0,
    moratoriumMonths: 18,
    tenureMonths: 180,
    collateral: 'Mixed secured and unsecured options',
    processingFeePercent: 1.5,
    highlights: ['Good for partially unsecured cases', 'Moratorium flexibility', 'Fast document turnaround'],
    officialLink: 'https://www.avanse.com',
  },
]

export function scoreLoanPlan(plan, preferences = {}) {
  let score = 0
  const amount = Number(preferences.requiredAmountLakhs || 40)
  const prefersLowInterest = Boolean(preferences.prefersLowInterest)
  const needsLongMoratorium = Boolean(preferences.needsLongMoratorium)
  const prefersNoMargin = Boolean(preferences.prefersNoMargin)
  const unsecuredPreference = Boolean(preferences.prefersUnsecured)

  if (plan.maxAmountLakhs >= amount) score += 35
  else score -= 30

  score += Math.max(0, 14 - plan.interestRate) * 6
  score += Math.max(0, plan.tenureMonths / 12)
  if (prefersLowInterest) score += Math.max(0, 12 - plan.interestRate) * 8
  if (needsLongMoratorium) score += plan.moratoriumMonths / 1.5
  if (prefersNoMargin) score += Math.max(0, 12 - plan.marginPercent) * 2
  if (unsecuredPreference && /unsecured|flexible/i.test(plan.collateral)) score += 18

  return Math.round(score)
}

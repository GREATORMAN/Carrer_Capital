import { colleges } from '../../frontend/src/data/colleges.js'
import { bankLoanPlans, scoreLoanPlan } from '../utils/loanPlans.js'

// Mocked AI controller - structured for the prototype UI with local retrieval sources.

const totalCost = (college) => college.feesLakhs + college.livingLakhs

function shortlistCollegeMatches(message) {
  const q = String(message || '').toLowerCase()
  return colleges
    .filter((college) => {
      const haystack = `${college.university} ${college.country} ${college.course} ${college.field}`.toLowerCase()
      return q.split(/\s+/).some((token) => token && haystack.includes(token))
    })
    .sort((a, b) => b.roiScore - a.roiScore)
    .slice(0, 3)
}

function shortlistLoanPlans(context = {}) {
  const preferences = {
    requiredAmountLakhs: context.requiredAmountLakhs || 40,
    prefersLowInterest: true,
    needsLongMoratorium: true,
    prefersUnsecured: false,
  }
  return bankLoanPlans
    .map((plan) => ({ ...plan, recommendationScore: scoreLoanPlan(plan, preferences) }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 3)
}

export const getCareerRecommendations = async () => {
  return {
    careers: [
      { title: 'Software Engineer', countries: ['USA', 'Canada'], tuitionEstimate: 40 },
      { title: 'Data Scientist', countries: ['Canada', 'Germany'], tuitionEstimate: 35 },
    ],
    universities: [
      { name: 'University of Toronto', country: 'Canada', costYear: 32000 },
      { name: 'ETH Zurich', country: 'Switzerland', costYear: 20000 },
    ],
  }
}

export const getRepaymentStrategy = async (loanData) => {
  return {
    strategy: 'Extra monthly payment of Rs 5000 plus one planned annual extra payment',
    estimatedSavings: 450000,
    newTenure: Math.max(36, loanData.tenure - 24),
  }
}

export const chat = async (message, context) => {
  const lower = String(message || '').toLowerCase()
  const profileStrength = context?.profileStrength || 72

  if (lower.includes('visa')) {
    const matches = shortlistCollegeMatches(message)
    return {
      text: 'Focus on funding proof, document clarity, and shortlist alignment. Visa confidence improves when your SOP, finances, and course intent all tell the same story.',
      links: [
        { title: 'Open visa readiness predictor', url: '/visa-predictor', type: 'internal' },
        { title: 'Government visa guidance', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html', type: 'external' },
        ...matches.map((college) => ({ title: `${college.university} official page`, url: college.officialLink, type: 'external' })),
      ],
      videos: [
        { title: 'Visa documentation checklist', url: 'https://www.youtube.com/results?search_query=student+visa+documentation+checklist' },
        { title: 'Funding proof for student visas', url: 'https://www.youtube.com/results?search_query=student+visa+funding+proof' },
      ],
      reviews: [
        'Students who prepare funding explanation early tend to report smoother visa documentation flow.',
        'Review patterns suggest course clarity matters as much as financial proof during visa preparation.',
      ],
      colleges: matches.map((college) => ({
        id: college.id,
        title: `${college.university} - ${college.course}`,
        totalCostLakhs: totalCost(college),
      })),
      suggestedStage: '07',
    }
  }

  if (lower.includes('emi') || lower.includes('repay') || lower.includes('loan') || lower.includes('reduce')) {
    const plans = shortlistLoanPlans(context)
    return {
      text: 'Use repayment strategy to compare tenure reduction versus lower monthly burden. The biggest savings usually come from earlier prepayments, not late ones.',
      links: [
        { title: 'Open EMI calculator', url: '/emi-calculator', type: 'internal' },
        { title: 'Explore dashboard financial outlook', url: '/dashboard', type: 'internal' },
        ...plans.map((plan) => ({ title: `${plan.bank} - ${plan.planName}`, url: plan.officialLink, type: 'external' })),
      ],
      videos: [
        { title: 'How prepayments reduce interest', url: 'https://www.youtube.com/results?search_query=how+loan+prepayment+reduces+interest' },
        { title: 'Understanding EMI breakdown', url: 'https://www.youtube.com/results?search_query=understanding+emi+breakdown' },
      ],
      reviews: [
        'Borrowers typically prefer shorter tenures when projected income is stable after graduation.',
        'Most students underestimate how interest-heavy the first repayment phase is.',
      ],
      bankPlans: plans.map((plan) => ({
        id: plan.id,
        bank: plan.bank,
        planName: plan.planName,
        interestRate: plan.interestRate,
      })),
      suggestedStage: '06',
    }
  }

  if (lower.includes('country') || lower.includes('budget') || lower.includes('college') || lower.includes('university')) {
    const matches = shortlistCollegeMatches(message)
    return {
      text: 'For a budget-led shortlist, compare total cost, country risk, and salary upside together instead of picking by ranking alone. Canada and Germany often stay strong for balanced ROI.',
      links: [
        { title: 'Open college finder', url: '/college-finder', type: 'internal' },
        { title: 'Review profile center', url: '/profile-enhancer', type: 'internal' },
        ...matches.map((college) => ({ title: `${college.university} apply page`, url: college.applyLink, type: 'external' })),
      ],
      videos: [
        { title: 'How to shortlist universities by ROI', url: 'https://www.youtube.com/results?search_query=how+to+shortlist+universities+by+roi' },
        { title: 'Budget planning for study abroad', url: 'https://www.youtube.com/results?search_query=study+abroad+budget+planning' },
      ],
      reviews: [
        'Students with fixed budgets respond well to shortlist views that show tuition and living cost together.',
        `Profiles around ${profileStrength}% completion usually get noticeably better recommendations after document cleanup.`,
      ],
      colleges: matches.map((college) => ({
        id: college.id,
        title: `${college.university} - ${college.course}`,
        totalCostLakhs: totalCost(college),
      })),
      suggestedStage: '04',
    }
  }

  return {
    text: 'You are in a good place to keep moving. Use the current stage, profile completion, and upcoming alerts together to decide the next best step.',
    links: [
      { title: 'Open dashboard', url: '/dashboard', type: 'internal' },
      { title: 'Review progress tracker', url: '/progress', type: 'internal' },
    ],
    videos: [
      { title: 'Study abroad planning roadmap', url: 'https://www.youtube.com/results?search_query=study+abroad+planning+roadmap' },
    ],
    reviews: [
      'Users make faster decisions when profile completion and next-step prompts stay visible on every screen.',
    ],
    suggestedStage: '01',
  }
}

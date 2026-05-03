import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { calculateEMI, calculateEarlyPaymentBenefit } from '../controllers/financialController.js'
import { bankLoanPlans, scoreLoanPlan } from '../utils/loanPlans.js'

const router = express.Router()

router.post('/calculate-emi', (req, res) => {
  const { principal, rate, tenure } = req.body
  const result = calculateEMI(principal, rate, tenure)
  res.json({ emi: result })
})

router.post('/optimize', verifyToken, (req, res) => {
  const { principal, rate, tenure, extraPayment } = req.body
  const result = calculateEarlyPaymentBenefit(principal, rate, tenure, extraPayment)
  res.json({ result })
})

router.get('/bank-plans', (req, res) => {
  const {
    requiredAmountLakhs,
    prefersLowInterest,
    needsLongMoratorium,
    prefersNoMargin,
    prefersUnsecured,
  } = req.query

  const preferences = {
    requiredAmountLakhs: Number(requiredAmountLakhs || 40),
    prefersLowInterest: prefersLowInterest === 'true',
    needsLongMoratorium: needsLongMoratorium === 'true',
    prefersNoMargin: prefersNoMargin === 'true',
    prefersUnsecured: prefersUnsecured === 'true',
  }

  const plans = bankLoanPlans
    .map((plan) => ({ ...plan, recommendationScore: scoreLoanPlan(plan, preferences) }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)

  res.json({ plans })
})

export default router

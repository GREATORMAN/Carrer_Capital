import express from 'express'
import { getCareerRecommendations, getRepaymentStrategy, chat } from '../controllers/aiController.js'

const router = express.Router()

router.post('/career-recommendations', async (req, res) => {
  const result = await getCareerRecommendations(req.body)
  res.json({ result })
})

router.post('/repayment-strategy', async (req, res) => {
  const result = await getRepaymentStrategy(req.body)
  res.json({ result })
})

router.post('/chat', async (req, res) => {
  const { message, context } = req.body
  const result = await chat(message, context)
  res.json({ result })
})

export default router

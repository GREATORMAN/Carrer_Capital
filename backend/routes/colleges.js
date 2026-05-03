import express from 'express'
import { colleges } from '../../frontend/src/data/colleges.js'

const router = express.Router()

const normalize = (value) => String(value || '').toLowerCase()
const totalCost = (college) => college.feesLakhs + college.livingLakhs

router.get('/', (req, res) => {
  const {
    q = '',
    country = 'All',
    courseType = 'All',
    field = 'All',
    maxBudget = 70,
    universityType = 'All',
    scholarship = 'Any',
  } = req.query

  const query = normalize(q)
  const results = colleges
    .filter((college) => {
      const haystack = normalize(`${college.university} ${college.country} ${college.city} ${college.course} ${college.field} ${college.courseType}`)
      if (query && !query.split(/\s+/).some((token) => haystack.includes(token))) return false
      if (country !== 'All' && college.country !== country) return false
      if (courseType !== 'All' && college.courseType !== courseType) return false
      if (field !== 'All' && college.field !== field) return false
      if (totalCost(college) > Number(maxBudget)) return false
      if (universityType !== 'All' && college.universityType !== universityType) return false
      if (scholarship !== 'Any' && college.scholarship !== (scholarship === 'Available')) return false
      return true
    })
    .map((college) => ({
      ...college,
      totalCostLakhs: totalCost(college),
    }))
    .sort((a, b) => b.roiScore - a.roiScore)

  res.json({
    count: results.length,
    results,
  })
})

router.get('/:id', (req, res) => {
  const college = colleges.find((item) => item.id === req.params.id)
  if (!college) return res.status(404).json({ error: 'College not found' })
  res.json({ ...college, totalCostLakhs: totalCost(college) })
})

export default router

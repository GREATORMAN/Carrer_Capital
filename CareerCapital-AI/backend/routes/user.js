import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  findUserById,
  updateCareerProfile,
  getCareerProfile,
  createLoan,
  getLoansByUserId,
  getStudentProfile,
  updateStudentProfile,
  getUserDocuments,
  upsertUserDocument,
  getUserShortlist,
  upsertShortlistItem,
  removeShortlistItem,
  getUserAlerts,
  replaceUserAlerts,
  markAlertRead,
} from '../utils/mockDb.js'
import { buildPersistentAlerts } from '../utils/workspace.js'

const router = express.Router()

router.get('/profile', verifyToken, (req, res) => {
  const user = findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ id: user.id, name: user.name, email: user.email })
})

router.put('/profile', verifyToken, (req, res) => {
  const user = findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  // In production, validate and update DB
  user.name = req.body.name || user.name
  res.json({ user: { id: user.id, name: user.name, email: user.email } })
})

router.get('/career-profile', verifyToken, (req, res) => {
  const profile = getCareerProfile(req.user.id)
  res.json({ profile })
})

router.put('/career-profile', verifyToken, (req, res) => {
  const profile = updateCareerProfile(req.user.id, req.body)
  res.json({ profile })
})

router.get('/profile-center', verifyToken, (req, res) => {
  const profile = getStudentProfile(req.user.id)
  const documents = getUserDocuments(req.user.id)
  res.json({ profile, documents })
})

router.put('/profile-center', verifyToken, (req, res) => {
  const profile = updateStudentProfile(req.user.id, req.body)
  res.json({ profile })
})

router.post('/documents', verifyToken, (req, res) => {
  const document = upsertUserDocument(req.user.id, req.body)
  res.json({ document })
})

router.get('/documents', verifyToken, (req, res) => {
  const documents = getUserDocuments(req.user.id)
  res.json({ documents })
})

router.get('/shortlist', verifyToken, (req, res) => {
  const shortlist = getUserShortlist(req.user.id)
  res.json({ shortlist })
})

router.post('/shortlist', verifyToken, (req, res) => {
  const item = upsertShortlistItem(req.user.id, req.body)
  res.json({ item })
})

router.put('/shortlist/:collegeId', verifyToken, (req, res) => {
  const item = upsertShortlistItem(req.user.id, {
    ...req.body,
    collegeId: req.params.collegeId,
  })
  res.json({ item })
})

router.delete('/shortlist/:collegeId', verifyToken, (req, res) => {
  const shortlist = removeShortlistItem(req.user.id, req.params.collegeId)
  res.json({ shortlist })
})

router.post('/alerts/sync', verifyToken, (req, res) => {
  const profile = getStudentProfile(req.user.id)
  const documents = getUserDocuments(req.user.id)
  const shortlist = getUserShortlist(req.user.id)
  const alerts = replaceUserAlerts(req.user.id, buildPersistentAlerts(profile, documents, shortlist))
  res.json({ alerts })
})

router.get('/alerts', verifyToken, (req, res) => {
  const alerts = getUserAlerts(req.user.id)
  res.json({ alerts })
})

router.patch('/alerts/:alertId', verifyToken, (req, res) => {
  const alert = markAlertRead(req.user.id, req.params.alertId, req.body?.isRead !== false)
  res.json({ alert })
})

router.get('/loans', verifyToken, (req, res) => {
  const loans = getLoansByUserId(req.user.id)
  res.json({ loans })
})

router.post('/loans', verifyToken, (req, res) => {
  const { amount, rate, tenure } = req.body
  const loan = createLoan(req.user.id, amount, rate, tenure)
  res.json({ loan })
})

export default router

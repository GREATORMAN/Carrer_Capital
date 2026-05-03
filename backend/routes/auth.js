import express from 'express'
import { body, validationResult } from 'express-validator'
import { createUser, findUserByEmail } from '../utils/mockDb.js'
import { generateToken } from '../utils/auth.js'

const router = express.Router()

router.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password, name } = req.body
  const existing = findUserByEmail(email)
  if (existing) return res.status(400).json({ error: 'User already exists' })

  const user = createUser(email, name, password)
  const token = generateToken(user.id, user.email)
  res.json({ user, token })
})

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body
  const user = findUserByEmail(email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  if (password !== user.password) return res.status(401).json({ error: 'Invalid credentials' })

  const token = generateToken(user.id, user.email)
  res.json({ user: { id: user.id, email: user.email, name: user.name }, token })
})

router.get('/verify', (req, res) => {
  res.json({ status: 'ok' })
})

export default router

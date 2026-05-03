import jwt from 'jsonwebtoken'
import config from '../config.js'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const verifyRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken

  if (!token) {
    return res.status(401).json({ error: 'No refresh token provided' })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

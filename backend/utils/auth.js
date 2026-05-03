import jwt from 'jsonwebtoken'
import config from '../config.js'

export const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )
}

export const generateRefreshToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    config.jwt.secret,
    { expiresIn: '30d' }
  )
}

export const verifyPassword = (password, hash) => {
  // In production, use bcrypt.compare()
  return password === hash
}

export const hashPassword = (password) => {
  // In production, use bcrypt.hash()
  return password
}

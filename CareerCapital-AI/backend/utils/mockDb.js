// Mock database for demonstration
// In production, use PostgreSQL with Sequelize

const users = new Map()
const loans = new Map()
const careerProfiles = new Map()
const studentProfiles = new Map()
const userDocuments = new Map()
const userShortlists = new Map()
const userAlerts = new Map()

let userIdCounter = 1
let loanIdCounter = 1

export const createUser = (email, name, password) => {
  const id = userIdCounter++
  const user = {
    id,
    email,
    name,
    password, // In production, hash this
    createdAt: new Date(),
  }
  users.set(id.toString(), user)
  return user
}

export const findUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email === email) return user
  }
  return null
}

export const findUserById = (id) => {
  return users.get(id.toString())
}

export const createLoan = (userId, amount, rate, tenure) => {
  const id = loanIdCounter++
  const loan = {
    id,
    userId,
    amount,
    rate,
    tenure,
    status: 'active',
    createdAt: new Date(),
  }
  loans.set(id.toString(), loan)
  return loan
}

export const getLoansByUserId = (userId) => {
  const userLoans = []
  for (const loan of loans.values()) {
    if (loan.userId === userId) userLoans.push(loan)
  }
  return userLoans
}

export const updateCareerProfile = (userId, profile) => {
  const existing = careerProfiles.get(userId.toString())
  const updated = { ...existing, ...profile, userId, updatedAt: new Date() }
  careerProfiles.set(userId.toString(), updated)
  return updated
}

export const getCareerProfile = (userId) => {
  return careerProfiles.get(userId.toString())
}

export const getStudentProfile = (userId) => {
  return studentProfiles.get(userId.toString()) || null
}

export const updateStudentProfile = (userId, profile) => {
  const existing = studentProfiles.get(userId.toString()) || {}
  const updated = {
    ...existing,
    ...profile,
    userId,
    updatedAt: new Date(),
  }
  studentProfiles.set(userId.toString(), updated)
  return updated
}

export const getUserDocuments = (userId) => {
  return userDocuments.get(userId.toString()) || []
}

export const upsertUserDocument = (userId, document) => {
  const existing = userDocuments.get(userId.toString()) || []
  const next = [...existing]
  const index = next.findIndex((item) => item.doc_type === document.doc_type)
  const updated = {
    ...next[index],
    ...document,
    userId,
    updatedAt: new Date(),
  }
  if (index >= 0) {
    next[index] = updated
  } else {
    next.push(updated)
  }
  userDocuments.set(userId.toString(), next)
  return updated
}

export const getUserShortlist = (userId) => {
  return userShortlists.get(userId.toString()) || []
}

export const upsertShortlistItem = (userId, item) => {
  const existing = userShortlists.get(userId.toString()) || []
  const next = [...existing]
  const index = next.findIndex((entry) => entry.collegeId === item.collegeId)
  const updated = {
    ...next[index],
    ...item,
    userId,
    updatedAt: new Date(),
    createdAt: next[index]?.createdAt || new Date(),
  }

  if (index >= 0) {
    next[index] = updated
  } else {
    next.push(updated)
  }
  userShortlists.set(userId.toString(), next)
  return updated
}

export const removeShortlistItem = (userId, collegeId) => {
  const existing = userShortlists.get(userId.toString()) || []
  const next = existing.filter((entry) => entry.collegeId !== collegeId)
  userShortlists.set(userId.toString(), next)
  return next
}

export const getUserAlerts = (userId) => {
  return userAlerts.get(userId.toString()) || []
}

export const replaceUserAlerts = (userId, alerts) => {
  const existing = userAlerts.get(userId.toString()) || []
  const existingMap = new Map(existing.map((alert) => [alert.id, alert]))
  const next = alerts.map((alert) => ({
    ...existingMap.get(alert.id),
    ...alert,
    userId,
    isRead: existingMap.get(alert.id)?.isRead || false,
    createdAt: existingMap.get(alert.id)?.createdAt || new Date(),
    updatedAt: new Date(),
  }))
  userAlerts.set(userId.toString(), next)
  return next
}

export const markAlertRead = (userId, alertId, isRead = true) => {
  const existing = userAlerts.get(userId.toString()) || []
  const next = existing.map((alert) =>
    alert.id === alertId
      ? { ...alert, isRead, updatedAt: new Date() }
      : alert
  )
  userAlerts.set(userId.toString(), next)
  return next.find((alert) => alert.id === alertId) || null
}

export const resetMockData = () => {
  users.clear()
  loans.clear()
  careerProfiles.clear()
  studentProfiles.clear()
  userDocuments.clear()
  userShortlists.clear()
  userAlerts.clear()
  userIdCounter = 1
  loanIdCounter = 1
}

/**
 * Local-storage based auth — works without a backend server.
 * All user data is persisted in the browser under 'cc_users_db'.
 * On real backend integration, swap these functions for API calls.
 */

const DB_KEY = 'cc_users_db'

function getDB() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function generateToken(userId) {
  // Simple base64 token — not cryptographically secure but sufficient for demo
  const payload = { id: userId, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return btoa(JSON.stringify(payload))
}

function decodeToken(token) {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

// ────────────────────────────────────────────
// Public API — same shape as the axios service
// ────────────────────────────────────────────

export const localAuthService = {
  signup: (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDB()
        const emailKey = email.toLowerCase().trim()

        // Check duplicate
        const existing = Object.values(db).find(u => u.email === emailKey)
        if (existing) {
          return reject({ response: { status: 409, data: { error: 'Account already exists. Please sign in instead.' } } })
        }

        // Create user
        const userId = `u_${Date.now()}`
        const user = {
          id: userId,
          name: name.trim(),
          email: emailKey,
          password, // plain-text demo only
          createdAt: new Date().toISOString(),
          goalProfile: null,
          stageProgress: {},
          savedColleges: [],
          chatHistory: [],
          profileCompletion: 0,
        }
        db[userId] = user
        saveDB(db)

        const token = generateToken(userId)
        const { password: _, ...safeUser } = user
        resolve({ data: { user: safeUser, token } })
      }, 600) // Simulate network delay
    })
  },

  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDB()
        const emailKey = email.toLowerCase().trim()
        const user = Object.values(db).find(u => u.email === emailKey)

        if (!user) {
          return reject({ response: { status: 401, data: { error: 'No account found with that email. Please sign up first.' } } })
        }
        if (user.password !== password) {
          return reject({ response: { status: 401, data: { error: 'Incorrect password. Please try again.' } } })
        }

        const token = generateToken(user.id)
        const { password: _, ...safeUser } = user
        resolve({ data: { user: safeUser, token } })
      }, 500)
    })
  },

  verifyToken: (token) => {
    return new Promise((resolve, reject) => {
      const payload = decodeToken(token)
      if (!payload || Date.now() > payload.exp) {
        return reject({ response: { status: 401, data: { error: 'Token expired' } } })
      }
      const db = getDB()
      const user = db[payload.id]
      if (!user) return reject({ response: { status: 401, data: { error: 'User not found' } } })
      const { password: _, ...safeUser } = user
      resolve({ data: { user: safeUser } })
    })
  },

  // Save user data back to localStorage (call this when goalProfile etc. changes)
  saveUserData: (userId, updates) => {
    const db = getDB()
    if (db[userId]) {
      db[userId] = { ...db[userId], ...updates, updatedAt: new Date().toISOString() }
      saveDB(db)
    }
  },

  getUserData: (userId) => {
    const db = getDB()
    return db[userId] || null
  },
}

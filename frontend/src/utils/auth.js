// Auth utilities
export const getToken = () => localStorage.getItem('authToken')

export const setToken = (token) => localStorage.setItem('authToken', token)

export const removeToken = () => localStorage.removeItem('authToken')

export const isTokenValid = (token) => {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

// Validation utilities
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

// Local storage utilities
export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getFromStorage = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

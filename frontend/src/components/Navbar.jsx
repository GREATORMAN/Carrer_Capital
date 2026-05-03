import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore, useThemeStore } from '../store'
import { motion } from 'framer-motion'
import { Moon, Sun, LogOut, Menu, X, Layers3 } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const navLinks = isAuthenticated ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'College Finder', href: '/college-finder' },
    { label: 'EMI', href: '/emi-calculator' },
    { label: 'Career', href: '/career-discovery' },
    { label: 'Progress', href: '/progress' },
  ] : [
    { label: 'Features', href: '#features' },
    { label: 'Finder', href: '/college-finder' },
    { label: 'About', href: '#about' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a2540] shadow-[0_10px_30px_rgba(10,37,64,0.22)] dark:bg-white"
            >
              <Layers3 className="h-5 w-5 text-white dark:text-slate-950" />
            </motion.div>
            <span className="hidden text-xl font-semibold tracking-[-0.03em] sm:inline">CareerCapital</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/60 p-1 shadow-sm backdrop-blur-xl md:flex dark:border-slate-800 dark:bg-slate-900/70">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-[#0a2540] hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="rounded-full p-2 hover:bg-white/70 dark:hover:bg-slate-800"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{user?.email}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-[#0a2540] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,37,64,0.20)] hover:bg-[#173b5c] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-slate-200 pb-4 md:hidden dark:border-slate-800"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block rounded px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

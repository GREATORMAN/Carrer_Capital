import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Lock, Mail, User, UserX } from 'lucide-react'
import { Button, InputField, ProgressBar } from '../components'
import { useAuthStore } from '../store'
import { localAuthService } from '../services/localAuth'
import { isStrongPassword, isValidEmail } from '../utils/auth'

export default function SignupPage() {
  const navigate = useNavigate()
  const { login, loginAsGuest, migrateGuestData, isGuest, guestData } = useAuthStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validateStep1 = () => {
    const next = {}
    if (!formData.name.trim()) next.name = 'Name is required'
    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!isValidEmail(formData.email)) next.email = 'Invalid email address'
    return next
  }

  const validateStep2 = () => {
    const next = {}
    if (!formData.password) next.password = 'Password is required'
    else if (!isStrongPassword(formData.password)) next.password = 'Use 8+ chars with uppercase, lowercase, number, and special character'
    if (formData.password !== formData.confirmPassword) next.confirmPassword = 'Passwords do not match'
    return next
  }

  const handleNextStep = () => {
    const next = validateStep1()
    if (Object.keys(next).length) setErrors(next)
    else setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validateStep2()
    if (Object.keys(next).length) return setErrors(next)
    setLoading(true)
    try {
      const { data } = await localAuthService.signup(formData.email, formData.password, formData.name)
      // If the user was a guest, migrate their local data
      if (isGuest && guestData) {
        migrateGuestData(data.user, data.token)
        // (In a real app, you'd POST guestData to your backend here to save permanently)
      } else {
        login(data.user, data.token)
      }
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 900)
    } catch (err) {
      const msg = err.response?.data?.error || ''
      if (err.response?.status === 409 || msg.toLowerCase().includes('already exists')) {
        setErrors({ email: 'Account already exists. Please sign in instead.' })
      } else {
        setErrors({ email: msg || 'Unable to create account. Please try again.' })
      }
      setLoading(false)
    }
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-12 md:grid-cols-2">
        {/* Left panel */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="hidden flex-col justify-center md:flex">
          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            {isGuest ? 'Save your progress permanently' : 'Create your planning workspace'}
          </h1>
          <p className="mb-8 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {isGuest
              ? 'You\'ve been exploring as a guest. Create a free account now to save all your work and access it from any device.'
              : 'Start with a focused dashboard for career choices, loan planning, visa readiness, and progress tracking.'}
          </p>
          <div className="space-y-4">
            {['Career recommendations', 'Education loan planning', 'Repayment optimization', 'Mentorship access', '10-stage progress tracker'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold">Create account</h2>
              <p className="text-slate-600 dark:text-slate-400">Step {step} of 2 — {step === 1 ? 'Basic info' : 'Set your password'}</p>
              <ProgressBar value={step === 1 ? 50 : 100} max={100} animated={false} className="mt-4" />
            </div>

            {/* Guest migration banner */}
            {isGuest && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
                <p className="font-semibold text-amber-700 dark:text-amber-400">Your guest data will be saved to your new account.</p>
              </div>
            )}

            {/* Success toast */}
            {success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                ✓ Account created! Redirecting to your dashboard...
              </div>
            )}

            <form onSubmit={step === 2 ? handleSubmit : undefined} className="space-y-5">
              {step === 1 ? (
                <>
                  <InputField label="Full name" placeholder="Your name" name="name" value={formData.name} onChange={handleChange} icon={User} error={errors.name} />
                  <InputField label="Email address" type="email" placeholder="you@example.com" name="email" value={formData.email} onChange={handleChange} icon={Mail} error={errors.email} />
                  {errors.email && errors.email.includes('already exists') && (
                    <Link to="/login" className="block text-center text-sm font-semibold text-sky-600 hover:underline">
                      Sign in to your existing account →
                    </Link>
                  )}
                  <Button type="button" size="lg" className="w-full gap-2" onClick={handleNextStep}>
                    Next step <ArrowRight className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <InputField label="Password" type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} icon={Lock} error={errors.password} />
                  <InputField label="Confirm password" type="password" placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} icon={Lock} error={errors.confirmPassword} />
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <p className="mb-2 font-semibold">Password requirements</p>
                    <ul className="space-y-1 text-xs">
                      <li>• At least 8 characters</li>
                      <li>• One uppercase and one lowercase letter</li>
                      <li>• One number and one special character</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" size="lg" className="flex-1 gap-2" disabled={loading || success}>
                      {loading ? 'Creating...' : <><ArrowRight className="h-5 w-5" /> Create account</>}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Guest mode */}
            {!isGuest && (
              <>
                <button
                  onClick={handleGuest}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <UserX className="h-4 w-4" />
                  Continue without signup (Guest Mode)
                </button>
                <p className="mt-2 text-center text-xs text-slate-400">
                  Your data stays in this browser. Create an account anytime to save permanently.
                </p>
              </>
            )}

            <div className="mt-6 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
              <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">Already have an account?</p>
              <Link to="/login" className="font-semibold text-sky-600 hover:underline">Sign in</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

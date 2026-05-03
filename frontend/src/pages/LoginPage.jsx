import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Brain, Calculator, Lock, Mail, UserX } from 'lucide-react'
import { Button, InputField } from '../components'
import { useAuthStore } from '../store'
import { localAuthService } from '../services/localAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginAsGuest } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }
    try {
      const { data } = await localAuthService.login(formData.email, formData.password)
      login(data.user, data.token)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to sign in. Please try again.')
      setLoading(false)
    }
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/dashboard')
  }

  const benefits = [
    { icon: BarChart3, title: 'Smart dashboards', desc: 'Track progress and finances.' },
    { icon: Brain, title: 'AI recommendations', desc: 'Get personalized guidance.' },
    { icon: Calculator, title: 'Financial tools', desc: 'Plan EMI and loan strategy.' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-12 md:grid-cols-2">
        {/* Left panel */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="hidden flex-col justify-center md:flex">
          <h1 className="mb-6 text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="mb-8 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Sign in to access your personalized planning dashboard and continue from your latest progress.
          </p>
          <div className="space-y-5">
            {benefits.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                    <Icon className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold">Sign in</h2>
              <p className="text-slate-600 dark:text-slate-400">Enter your credentials to access your dashboard.</p>
            </div>

            {/* Success state */}
            {success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                ✓ Signed in successfully! Loading your dashboard...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField label="Email address" type="email" placeholder="you@example.com" name="email" value={formData.email} onChange={handleChange} icon={Mail} />
              <InputField label="Password" type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} icon={Lock} />
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              )}
              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading || success}>
                {loading ? 'Signing in...' : <><ArrowRight className="h-5 w-5" /> Sign in</>}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Continue as Guest */}
            <button
              onClick={handleGuest}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <UserX className="h-4 w-4" />
              Continue without signing in (Guest Mode)
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Your data stays in this browser. Create an account anytime to save permanently.
            </p>

            <div className="mt-6 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
              <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">Don't have an account?</p>
              <Link to="/signup" className="font-semibold text-sky-600 hover:underline">Create a free account</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

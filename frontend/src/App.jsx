import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore, useAuthStore } from './store'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import AppSidebar from './components/AppSidebar'
import { WorkspaceTopNav, StickyNextStep, GuestBanner } from './components'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import EMICalculator from './pages/EMICalculator'
import CareerDiscovery from './pages/CareerDiscovery'
import ProgressTracker from './pages/ProgressTracker'
import VisaPredictor from './pages/VisaPredictor'
import MentorshipMarketplace from './pages/MentorshipMarketplace'
import SmartLivingAssistant from './pages/SmartLivingAssistant'
import ProfileEnhancer from './pages/ProfileEnhancer'
import CollegeFinder from './pages/CollegeFinder'
import AdmissionPlanning from './pages/AdmissionPlanning'
import AIEngine from './pages/AIEngine'
import AIAssistant from './pages/AIAssistant'
import AlertsPage from './pages/AlertsPage'
import ScholarshipsPage from './pages/ScholarshipsPage'
import LoanIntelligence from './pages/LoanIntelligence'

const workspaceRoutes = new Set([
  '/dashboard',
  '/ai-engine',
  '/ai-assistant',
  '/alerts',
  '/emi-calculator',
  '/career-discovery',
  '/admission-planning',
  '/college-finder',
  '/progress',
  '/visa-predictor',
  '/mentorship',
  '/living-assistant',
  '/profile-enhancer',
  '/scholarships',
  '/loan-intelligence',
])

export default function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('cc-splash-seen'))

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (!showSplash) return
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('cc-splash-seen', 'true')
      setShowSplash(false)
    }, 2300)
    return () => window.clearTimeout(timer)
  }, [showSplash])

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <AppFrame />
    </Router>
  )
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[999] grid place-items-center overflow-hidden bg-[#020617] text-white"
    >
      <div className="absolute inset-0 water-surface" />
      <motion.div
        initial={{ y: -260, scale: 0.42, opacity: 0 }}
        animate={{ y: [ -260, 0, -20, 0 ], scale: [0.42, 1.08, 0.96, 1], opacity: [0, 1, 1, 1] }}
        transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="water-drop" />
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1.8, 2.8], opacity: [0, 0.5, 0] }}
          transition={{ delay: 0.8, duration: 1.05, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/70"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.08, duration: 0.65 }}
        className="absolute bottom-20 text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.42em] text-cyan-200">CareerCapital AI</p>
        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Your future, loading with clarity</p>
      </motion.div>
    </motion.div>
  )
}

function AppFrame() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()
  const isWorkspace = isAuthenticated && workspaceRoutes.has(location.pathname)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="mesh-bg min-h-screen text-slate-900 dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="float-orb left-[6%] top-[16%] h-40 w-40 bg-indigo-400/20" />
        <div className="float-orb right-[8%] top-[24%] h-56 w-56 bg-cyan-300/20 animation-delay-1000" />
        <div className="float-orb bottom-[10%] left-[40%] h-48 w-48 bg-emerald-300/20 animation-delay-2000" />
      </div>
      {isWorkspace ? (
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <WorkspaceTopNav />
            <GuestBanner />
            <main className="min-w-0 flex-1">
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-engine" element={<AIEngine />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/emi-calculator" element={<EMICalculator />} />
              <Route path="/loan-intelligence" element={<LoanIntelligence />} />
              <Route path="/career-discovery" element={<CareerDiscovery />} />
              <Route path="/admission-planning" element={<AdmissionPlanning />} />
              <Route path="/college-finder" element={<CollegeFinder />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/visa-predictor" element={<VisaPredictor />} />
              <Route path="/mentorship" element={<MentorshipMarketplace />} />
              <Route path="/living-assistant" element={<SmartLivingAssistant />} />
              <Route path="/profile-enhancer" element={<ProfileEnhancer />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
            </Routes>
            </main>
            <StickyNextStep />
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-engine" element={<AIEngine />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/emi-calculator" element={<EMICalculator />} />
              <Route path="/career-discovery" element={<CareerDiscovery />} />
              <Route path="/admission-planning" element={<AdmissionPlanning />} />
              <Route path="/college-finder" element={<CollegeFinder />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/visa-predictor" element={<VisaPredictor />} />
              <Route path="/mentorship" element={<MentorshipMarketplace />} />
              <Route path="/living-assistant" element={<SmartLivingAssistant />} />
              <Route path="/profile-enhancer" element={<ProfileEnhancer />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </motion.div>
  )
}

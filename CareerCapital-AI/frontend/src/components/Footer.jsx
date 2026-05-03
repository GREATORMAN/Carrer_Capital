import React from 'react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-md">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                <span className="font-bold text-white">CC</span>
              </div>
              <span className="text-lg font-bold">CareerCapital</span>
            </div>
            <p className="text-sm text-slate-400">
              Where Career Meets Financial Planning. Empowering students with AI-driven insights.
            </p>
          </motion.div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">TEAM 🚀</p>
              <p className="mt-1 text-sm text-slate-400">Hackathon prototype built for CareerCapital AI.</p>
            </div>
            <div className="text-sm text-slate-300">
              <span className="font-medium">Team Members:</span> VISHALSAI BJ and D VARSHINI
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

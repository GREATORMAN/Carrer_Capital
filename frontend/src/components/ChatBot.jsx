import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Minimize2, Send, X } from 'lucide-react'
import { aiService } from '../services/api'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([{ id: 1, type: 'bot', text: 'Hello. I can help with career planning, loans, visa readiness, and budgets.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = { id: messages.length + 1, type: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)
    try {
      const { data } = await aiService.getChatResponse(input, {})
      setMessages((prev) => [...prev, { id: prev.length + 1, type: 'bot', text: data.result?.text || 'Use the dashboard, admission planning, and profile enhancement together for a stronger answer.' }])
    } catch {
      setMessages((prev) => [...prev, { id: prev.length + 1, type: 'bot', text: 'I could not reach the decision engine just now. Try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 16 }} className="fixed bottom-24 right-4 z-40 flex h-[28rem] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:right-6">
            <div className="flex items-center justify-between bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950">
              <div><h3 className="font-bold">CareerCapital AI</h3><p className="text-xs opacity-80">Planning assistant</p></div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(true)} className="rounded-md p-1 hover:bg-white/20 dark:hover:bg-slate-200"><Minimize2 className="h-4 w-4" /></button>
                <button onClick={() => setIsOpen(false)} className="rounded-md p-1 hover:bg-white/20 dark:hover:bg-slate-200"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg px-4 py-2 text-sm ${msg.type === 'user' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'}`}>{msg.text}</div>
                </div>
              ))}
              {loading && <div className="text-sm text-slate-500">Thinking...</div>}
            </div>
            <div className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask a planning question..." className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950" />
              <button onClick={handleSend} disabled={!input.trim() || loading} className="rounded-lg bg-slate-950 p-2 text-white disabled:opacity-50 dark:bg-white dark:text-slate-950"><Send className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isMinimized || !isOpen) && (
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => { setIsOpen(true); setIsMinimized(false) }} className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

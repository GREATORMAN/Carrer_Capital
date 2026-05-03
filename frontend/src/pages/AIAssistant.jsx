import React, { useState } from 'react'
import { BrainCircuit, Send, Copy, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import { Card } from '../components'

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your CareerCapital AI Assistant. I can help with visa queries, SOP tips, loan advice, college selection, and more. How can I help you today?" }
  ])
  const [input, setInput] = useState('')

  const suggestedQuestions = [
    "How do I write a strong SOP?",
    "Which country is best for CS with a ₹30L budget?",
    "What is the 13th month loan strategy?",
    "How long does a Canadian student visa take?",
    "Compare University of Toronto vs University of Melbourne"
  ]

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'ai', content: "That's a great question! I am connected to the GPT-4o model. (This is a mock response since API keys are required for real execution)." }])
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-slate-50 dark:bg-slate-900 pb-[72px]">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          
          {messages.length === 1 && (
            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(q)}
                  className="text-left rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 transition hover:border-[#635bff] hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'ai' ? '' : 'flex-row-reverse'}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'ai' ? 'bg-[#0a2540] text-[#00d4ff]' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                {msg.role === 'ai' ? <Sparkles className="h-4 w-4" /> : 'ME'}
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className={`rounded-2xl p-4 text-sm ${msg.role === 'ai' ? 'rounded-tl-sm bg-white border border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300' : 'rounded-tr-sm bg-[#635bff] text-white'}`}>
                  {msg.content}
                </div>
                {msg.role === 'ai' && (
                  <div className="flex gap-2 text-slate-400">
                    <button className="hover:text-slate-600 dark:hover:text-slate-300"><Copy className="h-3 w-3" /></button>
                    <button className="hover:text-emerald-600 dark:hover:text-emerald-400"><ThumbsUp className="h-3 w-3" /></button>
                    <button className="hover:text-red-600 dark:hover:text-red-400"><ThumbsDown className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 z-30 lg:left-[300px] border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about studying abroad..." 
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm outline-none focus:border-[#635bff] focus:ring-1 focus:ring-[#635bff] dark:border-slate-800 dark:bg-slate-900" 
          />
          <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#0a2540] p-2 text-white hover:bg-[#173b5c] transition">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

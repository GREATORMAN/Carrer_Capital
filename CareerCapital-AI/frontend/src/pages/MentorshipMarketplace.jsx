import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, MapPin, Star, UserRound, Video } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components'

export default function MentorshipMarketplace() {
  const mentors = [
    { id: 1, name: 'Priya Sharma', title: 'Senior Software Engineer at Google', country: 'USA', specialization: 'Data Science and ML', rating: 4.9, reviews: 127, price: 1500, availability: 'Available', bio: 'MS from Stanford, 8+ years of AI/ML experience.' },
    { id: 2, name: 'Arjun Patel', title: 'Product Manager at Microsoft', country: 'Canada', specialization: 'Career Strategy', rating: 4.8, reviews: 98, price: 1200, availability: 'Available', bio: 'IIT Delhi, MBA from UPenn, 6+ years in technology.' },
    { id: 3, name: 'Anjali Verma', title: 'Finance Manager at JP Morgan', country: 'UK', specialization: 'Loan Strategy', rating: 4.7, reviews: 156, price: 1800, availability: 'Booked this week', bio: 'CFA, 10+ years in investment banking.' },
  ]

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="page-shell max-w-6xl">
        <PageHeader
          eyebrow="Mentorship"
          title="Book focused guidance from experienced mentors."
          description="Compare mentors by expertise, location, availability, and price before scheduling a session."
        />

        <div className="mb-8 flex flex-wrap gap-3">
          {['All', 'Career Strategy', 'Loan Planning', 'Technical Skills', 'Visa Help'].map((filter) => (
            <Button key={filter} variant={filter === 'All' ? 'primary' : 'outline'} size="sm">{filter}</Button>
          ))}
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor, idx) => (
            <motion.div key={mentor.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <Card hover={false} className="flex h-full flex-col">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                      <UserRound className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{mentor.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{mentor.title}</p>
                    </div>
                  </div>
                  <Badge variant="success">{mentor.rating}</Badge>
                </div>

                <div className="mb-4 flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-sky-600" /><span>{mentor.country}</span></div>
                  <div className="flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4 text-sky-600" /><span>{mentor.specialization}</span></div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{mentor.bio}</p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                  <div><p className="text-xs text-slate-500">Reviews</p><p className="font-bold">{mentor.reviews}</p></div>
                  <div><p className="text-xs text-slate-500">Rating</p><p className="flex items-center gap-1 font-bold"><Star className="h-4 w-4 text-amber-500" />{mentor.rating}</p></div>
                </div>

                <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm font-medium text-sky-900 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200">
                  {mentor.availability}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Rs {mentor.price}/hour</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500"><Video className="h-4 w-4" />Video call</span>
                  </div>
                  <Button className="w-full">Book session</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card hover={false}>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold"><Calendar className="h-5 w-5 text-sky-600" /> How it works</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {['Browse mentors', 'Book session', 'Join video call', 'Apply insights'].map((step, idx) => (
              <div key={step} className="rounded-lg border border-slate-200 p-4 text-center dark:border-slate-800">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">{idx + 1}</div>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

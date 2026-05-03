import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bus, Home, MapPin, Utensils } from 'lucide-react'
import { Badge, Button, Card, PageHeader, ProgressBar } from '../components'

export default function SmartLivingAssistant() {
  const [selectedCity, setSelectedCity] = useState(null)

  const cities = [
    { id: 1, name: 'Toronto', country: 'Canada', costOfLiving: 1800, rent: 800, food: 400, transport: 100, quality: 9, safety: 9, studentComm: 8, jobOpportunities: 9, climate: 'Cold', bestFor: 'Technology, finance, quality of life' },
    { id: 2, name: 'Bangalore', country: 'India', costOfLiving: 600, rent: 250, food: 150, transport: 50, quality: 7, safety: 7, studentComm: 9, jobOpportunities: 8, climate: 'Tropical', bestFor: 'Technology jobs and startup culture' },
    { id: 3, name: 'Sydney', country: 'Australia', costOfLiving: 2100, rent: 900, food: 450, transport: 150, quality: 9, safety: 9, studentComm: 8, jobOpportunities: 8, climate: 'Temperate', bestFor: 'Work-life balance and student life' },
    { id: 4, name: 'Berlin', country: 'Germany', costOfLiving: 1200, rent: 500, food: 300, transport: 86, quality: 9, safety: 9, studentComm: 8, jobOpportunities: 7, climate: 'Temperate', bestFor: 'Technology, arts, and lower cost base' },
  ]

  const tips = [
    { icon: Home, title: 'Housing', desc: 'Compare university housing, shared rentals, and verified local portals before signing.' },
    { icon: Utensils, title: 'Food budget', desc: 'Meal planning and grocery-first routines can reduce monthly spend significantly.' },
    { icon: Bus, title: 'Transport', desc: 'Check student passes and neighborhood commute times before choosing housing.' },
  ]

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="page-shell max-w-6xl">
        <PageHeader
          eyebrow="Living assistant"
          title="Compare cities before planning your move."
          description="Evaluate monthly costs, safety, quality of life, student community, and job access in one view."
        />

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {cities.map((city, idx) => (
            <motion.div key={city.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <Card hover={false} className="h-full cursor-pointer" onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{city.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-slate-500 dark:text-slate-400"><MapPin className="h-4 w-4" />{city.country}</p>
                  </div>
                  <Badge>{city.climate}</Badge>
                </div>

                <div className="mb-6 grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                  {[['Monthly', city.costOfLiving], ['Rent', city.rent], ['Food', city.food], ['Transit', city.transport]].map(([label, value]) => (
                    <div key={label} className="text-center">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="font-bold">Rs {value}K</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[['Quality of life', city.quality], ['Safety', city.safety], ['Student community', city.studentComm], ['Job opportunities', city.jobOpportunities]].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{value}/10</span></div>
                      <ProgressBar value={value} max={10} animated={false} />
                    </div>
                  ))}
                </div>

                {selectedCity === city.id && (
                  <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <p className="text-sm font-semibold">Best for</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{city.bestFor}</p>
                    <Button className="mt-4 w-full">Explore housing options</Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <Card hover={false}>
          <h2 className="mb-6 text-2xl font-bold">Living strategy tips</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {tips.map((tip) => {
              const Icon = tip.icon
              return (
                <div key={tip.title} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <Icon className="mb-3 h-6 w-6 text-sky-600" />
                  <h3 className="font-semibold">{tip.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tip.desc}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

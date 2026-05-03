import express from 'express'
import cors from 'cors'
import config from './config.js'

// Routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import financialRoutes from './routes/financial.js'
import aiRoutes from './routes/ai.js'
import collegeRoutes from './routes/colleges.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/financial', financialRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/colleges', collegeRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
    },
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
const PORT = config.port
app.listen(PORT, () => {
  console.log(`🚀 CareerCapital API running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
})

export default app

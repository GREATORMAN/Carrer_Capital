import dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  database: {
    name: process.env.DB_NAME || 'careercapital',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
}

CareerCapital AI - Backend

This is a mock backend for development. It uses an in-memory mock DB defined in `utils/mockDb.js`.

To run:
1. cd backend
2. npm install
3. npm run dev

Routes:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/users/profile (requires Authorization header Bearer <token>)
- POST /api/financial/calculate-emi
- POST /api/ai/chat

Note: For production, replace mock DB with PostgreSQL and secure password hashing.

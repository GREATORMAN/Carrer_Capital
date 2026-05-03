# Deployment options for CareerCapital-AI

Local via Docker (recommended for quick hosting):

1) Build and run with docker-compose:

```powershell
docker compose up --build -d
```

2) Visit http://localhost:3000 for the frontend and http://localhost:5000 for the backend.

Deploy to GitHub Pages (static frontend only):

1) Push the repo to GitHub (main branch).
2) The workflow `.github/workflows/deploy-frontend.yml` will build `frontend` and publish `frontend/dist` to GitHub Pages.

Deploy to Vercel/Netlify:

- Connect the `frontend` folder as a project, set build command `npm run build`, and publish directory `dist`.

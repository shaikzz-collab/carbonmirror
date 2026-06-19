# 🌿 Carbon Mirror

**Carbon Mirror** is a premium, high-fidelity Climate Intelligence & Carbon Twin visualization platform. It allows users to build a persistent "Carbon DNA Profile" based on a 12-step lifestyle scan, track their daily micro-decisions with an itemized "Carbon Receipt", simulate future compound emissions under a 10-year "Time Capsule", and optimize daily habits with AI coaching.

---

## 🚀 Tech Stack

- **Frontend:** React (TypeScript) + Vite + TailwindCSS
- **Backend:** Node.js + Express (TypeScript, tsx watch)
- **Database:** SQLite (persisted locally with SQL queries)
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs hashing
- **Icons & Visuals:** Lucide React

---

## 🛠️ Local Development Setup

To run both frontend and backend services locally:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install dependencies
From the root directory:
```bash
npm install
```

### 2. Configure Backend Secrets
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_token_2026
```

### 3. Spin up the application
You need to run both the backend server and frontend development client:

- **Run Backend Server (Port 5000):**
  ```bash
  cd server
  npm run dev
  ```
- **Run Frontend Client (Port 5173 with API proxying):**
  ```bash
  # In a new terminal at root directory
  npm run dev
  ```

Visit `http://localhost:5173` to experience the platform.

---

## ☁️ Deployment Guide

This repository is optimized for one-click deployment on platforms like **Render**, **Railway**, or **Heroku**. 

The application is structured as a unified service: when built, the Express server automatically serves the frontend static build from the `dist/` directory and exposes the `/api/` endpoints.

### Deploying to Render
1. Go to [Render](https://render.com/) and log in.
2. Click **New** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/shaikzz-collab/carbonmirror`
4. Configure the web service:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `JWT_SECRET`: A secure key string (e.g. `somesecretkeyhere`)
6. Click **Deploy Web Service**. Render will install, compile both frontend/backend, and serve your app.

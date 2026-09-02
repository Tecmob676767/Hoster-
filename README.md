# Hoster++ 🚀

> **More advanced than Vercel** — A full-featured web hosting platform with Google login, drag-and-drop file uploads, AI token deploy, custom domains, and auto SSL.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔑 **Google OAuth** | One-click login with Google |
| 📁 **Drag & Drop Upload** | Drop files in the dashboard and deploy instantly |
| 🤖 **AI Token Upload** | Generate a token → give to AI → AI deploys automatically |
| 🌐 **Custom Domains** | Clean domains, no forced subdomains |
| 🔒 **Auto SSL** | Let's Encrypt for every domain |
| 📊 **Deployment History** | Versioned deploys with rollback info |

---

## 📁 Project Structure

```
Hoster++/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── auth/          # Passport + Google OAuth
│   │   ├── routes/        # auth, projects, upload, tokens, domains
│   │   ├── middleware/    # auth guard, AI token validator
│   │   └── services/      # Nginx config + SSL provisioning
│   └── prisma/            # PostgreSQL schema
├── frontend/         # React + Vite + TailwindCSS
│   └── src/
│       ├── pages/         # Landing, Dashboard, Project, AIToken
│       └── components/    # Layout, etc.
└── nginx-templates/  # Nginx virtual host templates
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally
- Google Cloud OAuth credentials

### 2. Backend Setup

```bash
cd backend

# Copy env and fill in your values
cp .env.example .env
# Edit .env: add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DATABASE_URL

# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:migrate

# Start dev server
npm run dev
```

Backend runs at: **http://localhost:4000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
5. Copy **Client ID** and **Client Secret** to `backend/.env`

---

## 🤖 AI Token Upload — How It Works

```bash
# 1. Generate a token in the dashboard (Project → AI Tokens)
# 2. Give the token to your AI agent with these instructions:

curl -X POST "http://localhost:4000/api/upload/YOUR_PROJECT_ID" \
  -H "Authorization: Bearer YOUR_AI_TOKEN" \
  -F "files[]=@index.html" \
  -F "files[]=@style.css" \
  -F "files[]=@app.js"

# 3. The AI deploys your files and gets back a response:
# { "success": true, "siteUrl": "https://yourdomain.com", "version": 3 }
```

---

## 🌐 Custom Domain Setup

1. In your project dashboard, go to the **Domain** tab
2. Enter your domain (e.g. `myapp.com`)
3. Add this DNS record in your domain registrar:
   - **A Record**: `@` → `YOUR_SERVER_IP`
   - **CNAME**: `www` → `myapp.com`
4. SSL auto-provisions via Let's Encrypt in production!

---

## 🏗️ Production Deployment

Deploy the backend on a VPS (DigitalOcean, Hetzner, etc.):

```bash
# Build
npm run build

# Set NODE_ENV=production in .env
# Configure real NGINX_SITES_DIR and NGINX_RELOAD_CMD
# Run with PM2:
pm2 start dist/index.js --name hosterplus-api
```

For SSL to work in production, install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

---

## 🛠️ API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/auth/google` | - | Start Google login |
| GET | `/auth/me` | Session | Get current user |
| POST | `/auth/logout` | Session | Logout |
| GET | `/api/projects` | Session | List projects |
| POST | `/api/projects` | Session | Create project |
| DELETE | `/api/projects/:id` | Session | Delete project |
| POST | `/api/upload/:projectId` | Session OR Token | Upload & deploy files |
| GET | `/api/upload/:projectId/files` | Session | List deployed files |
| POST | `/api/tokens` | Session | Generate AI token |
| GET | `/api/tokens` | Session | List tokens |
| DELETE | `/api/tokens/:id` | Session | Revoke token |
| POST | `/api/domains/:projectId` | Session | Add custom domain |
| DELETE | `/api/domains/:projectId` | Session | Remove domain |

---

Built with ❤️ by Hoster++

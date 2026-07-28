# ✈️ MailPilot AI

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.140-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-allanabtech%2FMailPilot--AI-181717.svg?logo=github)](https://github.com/allanabtech/MailPilot-AI)

**A local-first, privacy-focused Email Cleaner & Organizer with AI classification, smart cleanup, 1-click newsletter unsubscribes, and automated rules.**

[Architecture](#architecture) • [Features](#features) • [Quickstart](#quickstart) • [Security](#security) • [Documentation](#documentation)

</div>

---

## 🌟 Highlights & Features

- **⚡ Linear & Vercel Inspired UI**: Built with React 19, Tailwind CSS, Framer Motion, Recharts analytics, and dark/light mode switching.
- **🔒 Privacy-First & Local Processing**: Stores metadata locally in SQLite/PostgreSQL. OAuth tokens are encrypted at rest using **AES-256 Fernet encryption**. Zero telemetry.
- **🏷️ 20 Smart Email Categories**: Automatic categorization into *Personal, Finance, Shopping, Travel, Education, Social, Forums, Updates, Promotions, Spam, Receipts, Subscriptions, GitHub, Banking, Government, Healthcare, OTP, Security, Work, and Custom*.
- **🛡️ Real-Time Phishing & Spam Guard**: Detects spoofed domains, suspicious link mismatches, and urgent credential harvesting indicators.
- **📰 1-Click Newsletter Unsubscribe**: Automatically extracts `List-Unsubscribe` headers and mailto triggers to stop unwanted subscriptions.
- **⚡ Dynamic Automation Rules Engine**: Create unlimited rules (*e.g., auto-delete OTPs > 30 days, archive newsletters, star banking alerts, label GitHub notifications*).
- **📎 Attachment Vault & Storage Analyzer**: Manage large attachments, view size distribution, and reclaim disk space.
- **🔎 Command Palette (`⌘+K`)**: Keyboard shortcuts for lightning-fast inbox management.
- **🔌 Dual-Engine & Extensible Plugin Architecture**: Seamlessly works in **Zero-Config Mock Engine** mode out of the box, with live Google OAuth integration and extensible plugins for *Microsoft Outlook, Yahoo, IMAP, and Proton Mail*.

---

## 🏗️ Architecture

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      MailPilot AI React 19 Frontend                    │
 │ - Linear/Vercel Aesthetic (Dark/Light mode, Framer Motion)             │
 │ - React Query, Lucide Icons, Recharts Analytics, Command Palette (⌘K)  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ REST APIs & WebSockets
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │                     FastAPI Python 3.13 Backend                        │
 │ - Auth & OAuth Token Encryption (Fernet AES-256)                      │
 │ - Email Classifier & AI Rules Engine (20 categories + OTP auto-clean)  │
 │ - Gmail API Engine & Extensible Plugin Architecture (IMAP/Outlook ready)│
 │ - Newsletter 1-Click Unsubscribe, Duplicate Detector, Storage Analyzer │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ SQLAlchemy 2.0 ORM & Alembic
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │                  SQLite (Local Default) / PostgreSQL Ready             │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

### Method 1: Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/allanabtech/MailPilot-AI.git
cd MailPilot-AI

# Launch application stack
docker-compose up --build
```
Open your browser at `http://localhost:5173` (Frontend) and `http://localhost:8000/docs` (FastAPI Swagger API docs).

---

### Method 2: Local Development Setup

#### 1. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Run Vite dev server
npm run dev
```

---

## 🧪 Testing

Run backend pytest suite:
```bash
cd backend
pytest
```

Run frontend build check:
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Privacy

- **Fernet Token Encryption**: All OAuth credentials and refresh tokens are encrypted before saving to the database.
- **Local SQLite Storage**: Email data remains under your local control.
- **OWASP Compliance**: Headers, CORS controls, and parameter validations enforced.

---

## 📄 License

Distributed under the [MIT License](LICENSE).

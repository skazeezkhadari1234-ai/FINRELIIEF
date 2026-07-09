# FinRelief AI – AI-Powered Debt Relief & Financial Recovery Platform

## 📌 Project Overview

FinRelief AI is a full-stack AI-powered financial recovery platform that helps borrowers manage debt, analyze financial health, predict settlement opportunities, and generate professional AI-assisted negotiation letters.

The application is developed using React.js for the frontend and FastAPI with Python for the backend.

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing

---

## Loan Management

- Add Loan
- Update Loan
- Delete Loan
- View Loan History

---

## Financial Health

- Monthly Income Analysis
- Monthly Expense Analysis
- EMI Ratio
- Debt-to-Income Ratio
- Monthly Surplus
- Stress Level Detection

---

## Settlement Prediction

- AI Settlement Recommendation
- Settlement Percentage
- Risk Score
- Priority Level
- Recommended Settlement Amount

---

## AI Negotiation

- Google Gemini AI Integration
- Negotiation Strategy
- Negotiation Letter Generator
- Rule-Based Fallback

---

## Dashboard

- Financial Summary
- Active Loans
- Financial Profile
- Real-time Analytics

---

## History

- AI History
- Settlement History
- Financial Reports

---

## Borrower Rights

- RBI Guidelines
- Banking Ombudsman
- Debt Recovery Rules
- Financial Planning

---

# Technology Stack

## Frontend

- React.js
- Vite
- Axios
- React Router

## Backend

- FastAPI
- Python 3.11
- SQLAlchemy
- Uvicorn

## Database

- SQLite

## Authentication

- JWT
- Passlib (bcrypt)

## AI

- Google Gemini API

---

# Installation

## Backend

```bash
python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file.

```env
DATABASE_URL=sqlite:///./finrelief.db

SECRET_KEY=YOUR_SECRET_KEY

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=120

GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
```

---

# API Endpoints

| Method | Endpoint |
|----------|-----------------------------|
| POST | /register |
| POST | /login |
| GET | /dashboard-data |
| GET | /financial-health |
| GET | /loans |
| POST | /add-loan |
| GET | /settlement-predictor |
| GET | /ai-negotiation-strategy |
| GET | /generate-negotiation-email/{loan_id} |
| GET | /history |

---

# Deployment

Frontend

```
npm run build
```

Backend

```
uvicorn app.main:app
```

---

# GitHub

```
git init

git add .

git commit -m "Initial Commit"

git branch -M main

git remote add origin <repository-url>

git push -u origin main
```

---

# Author

Azeez Khadari Shaik

Internship Project

FinRelief AI
# 🚀 LeadFlow CRM — Smart Lead Management System

A lightweight full-stack CRM application built to manage leads, track discussions, and schedule follow-ups in a clean, single-screen dashboard.

---

## 🌟 Features

- 📋 Create and manage leads
- 🏷️ Status tracking (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- 💬 Lead discussion timeline (like CRM history log)
- ⏰ Follow-up scheduling system
- 🔍 Search & filter leads
- 📌 Today’s follow-ups pinned on top
- ⚡ Instant UI updates after actions

---

## 🛠️ Tech Stack

**Frontend:**
- React
- TypeScript
- Tailwind CSS

**Backend:**
- Node.js
- Express.js

**Database:**
- Prisma ORM

---

## 🏗️ Architecture


Frontend (React + Tailwind)
↓
REST API (Express.js)
↓
Database (Prisma)


---

## 📸 UI Preview

> Add screenshots inside `/screenshots` folder








---

## 🚀 How to Run Locally

### 1. Clone repository

git clone <your-repo-url>
cd leadflow-crm


### 2. Setup Backend

cd server
npm install
npx prisma generate
npm run dev


Backend runs on:

http://localhost:4000


---

### 3. Setup Frontend

cd client
npm install
npm run dev


Frontend runs on:

http://localhost:5173


---

## 🔗 API Base URL


http://localhost:4000/api


---

## 💡 Project Highlights

- Built a real-world CRM-style workflow system
- Implemented full lead lifecycle management
- Designed modular and scalable architecture
- Focus on UX with single-screen dashboard
- Real-time updates between UI and backend

---

## 👨‍💻 Author

**Riya Bhardwaj**

---

## 📌 Note

This project is built for learning full-stack development and demonstrates:
- API integration
- State management
- Backend architecture
- Database modeling

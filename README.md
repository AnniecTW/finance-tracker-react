# Expense Tracker

A full-stack expense tracking web application that helps users manage and analyze their spending.  
Built with **React (frontend)**, **Node.js / Express (backend)**, and **PostgreSQL (database)**.

Note: This is an early version — UI styling and backend validation are still in progress.

---

## Features

- Full CRUD functionality (create, read, update, delete)
- Display expense overview with database integration
- Hybrid state management:
  - **Context API** for global overview state
  - **React Query** for server state (e.g. fetching single expense details)
- Modular service layer for clean API integration
- Backend built with **Express.js**, connected to **PostgreSQL**

---

## Roadmap

- UI styling & responsive design
- Backend validation & authentication (JWT sessions)
- Stats & charts for better visualization
- Expense categories & recurring expense support

---

## Installation

1. Clone the repo
   ```bash
   git clone https://github.com/AnniecTW/finance-tracker-react.git
   cd expense-tracker
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file based on the provided `.env.example`
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database credentials.
5. Run backend & frontend
   ```bash
   npm run dev
   ```

## Environment Variables

Copy `.env.example` to `.env` and replace with your own credentials:

```bash
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=finance_tracker
```

## Tech Stack

- Frontend: React, React Router, React Query, Context API, Axios
- Backend: Node.js, Express.js
- Database: PostgreSQL

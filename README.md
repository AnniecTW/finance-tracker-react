# Expense Tracker

A full-stack expense tracking web application that helps users manage and analyze their spending.  
Built with **React** for the frontend and **Supabase** for a scalable, serverless backend.

**Live Demo:** [Click here to view the app](https://finance-tracker-react-pi.vercel.app)

Note: **Core CRUD features** and **User Authentication** are fully functional. Upcoming updates will focus on **Data Visualization** and **UI Polish**.

---

## Features

- **Expense Management:** Full CRUD capabilities with real-time updates.
- **Smart Analytics:** Instant overview of spending habits filtered by Day, Week, Month, and Year.
- **State Management:** Uses **React Query** for optimized data fetching and caching.
- **Modern Backend:** Built with **Supabase**, leveraging PostgreSQL for reliable data storage without managing a Node.js server.

---

## Roadmap

- **Core Features:** Expense CRUD (Create, Read, Update, Delete)
- **Authentication:** User login/signup via Supabase Auth
- **Performance:** Client-side aggregation for instant dashboard stats
- **Organization:** Category management & recurring expenses
- **Visualization:** Interactive charts for spending analysis
- **UI/UX:** Responsive design & styling improvements

---

## Installation

1. **Clone the repo**

   ```bash
   git clone [https://github.com/AnniecTW/finance-tracker-react.git](https://github.com/AnniecTW/finance-tracker-react.git)
   cd finance-tracker-react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`

   ```bash
   cp .env.example .env
   ```

4. **Database Setup (Supabase)**

   - Create a new project on [Supabase](https://supabase.com/).
   - **(Required)** Create a table named `transactions` with the following columns:
     - `id` (int8, Primary Key)
     - `created_at` (timestamptz, Default: `now()`)
     - `item` (text)
     - `amount` (numeric)
     - `category` (text)
     - `note` (text)
     - `image` (text)
     - `user_id` (uuid) _Important: For linking data to specific users_
   - _(Optional)_ Enable Row Level Security (RLS) policies to protect user data.

5. **Configure Credentials**
   Update `.env` with your Supabase Project URL and Anon Key.

6. **Run the application**
   ```bash
   npm run dev
   ```

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file.

**Note:** You can find these in your Supabase Dashboard under `Project Settings` -> `API`.

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Tech Stack

- **Framework:** React 19 (via Vite)
- **Backend & DB:** Supabase (PostgreSQL)
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form
- **Utilities:** date-fns

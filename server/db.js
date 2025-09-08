import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

console.log("DB URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

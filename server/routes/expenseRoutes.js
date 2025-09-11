import express from "express";
import pool from "../db.js";

const router = express.Router();

const user_id = "8e0c09e5-82e6-4a09-ada4-3943b1315735"; // FAKE user_id, normally get from auth middleware after login

// Get all expenses
router.get("/expenses/getAll", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new expense
router.post("/expenses/add", async (req, res) => {
  const { item, amount } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO transactions (user_id, item, amount) VALUES ($1, $2, $3) RETURNING *",
      [user_id, item, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an expense by ID
router.delete("/expenses/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get today's expenses
router.get("/expenses/today", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 AND DATE(date) = CURRENT_DATE",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get this week's expenses
router.get("/expenses/week", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 AND DATE(date) >= date_trunc('week', CURRENT_DATE)",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get this month's expenses
router.get("/expenses/month", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 AND DATE(date) >= date_trunc('month', CURRENT_DATE)",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get this year's expenses
router.get("/expenses/year", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 AND DATE(date) >= date_trunc('year', CURRENT_DATE)",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single expense by ID
router.get("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

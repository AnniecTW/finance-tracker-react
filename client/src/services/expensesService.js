import axios from "../utils/axiosInstance";

// Get all expenses from backend
export async function fetchAllExpenses() {
  try {
    const res = await axios.get("/expenses/getAll");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch expenses: ", err);
    throw err;
  }
}

// Add new expense to backend
export async function addExpenses(expenses) {
  try {
    const res = await axios.post("/expenses/add", expenses);
    return res.data;
  } catch (err) {
    console.error("Failed to save expenses: ", err);
    throw err;
  }
}

// Delete expense by id from backend
export async function deleteExpenseById(id) {
  try {
    const res = await axios.delete(`/expenses/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete expenses: ", err);
    throw err;
  }
}

// Get today's expenses from backend
export async function fetchTodaysExpenses() {
  try {
    const res = await axios.get("/expenses/today");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch today's expenses: ", err);
    throw err;
  }
}

// Get this week's expenses from backend
export async function fetchWeeksExpenses() {
  try {
    const res = await axios.get("/expenses/week");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch week's expenses: ", err);
    throw err;
  }
}

// Get this month's expenses from backend
export async function fetchMonthsExpenses() {
  try {
    const res = await axios.get("/expenses/month");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch month's expenses: ", err);
    throw err;
  }
}

// Get this year's expenses from backend
export async function fetchYearsExpenses() {
  try {
    const res = await axios.get("/expenses/year");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch year's expenses: ", err);
    throw err;
  }
}

// Get single expense by id from backend
export async function fetchExpenseById(id) {
  try {
    const res = await axios.get(`expenses/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch expense: ", err);
    throw err;
  }
}

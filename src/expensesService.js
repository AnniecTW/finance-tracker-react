export async function fetchExpenses() {
  try {
    const saved = localStorage.getItem("expenses");
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed;
  } catch (err) {
    console.error("Failed to fetch expenses: ", err);
    throw err;
  }
}

export async function saveExpenses(expenses) {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (err) {
    console.error("Failed to save expenses: ", err);
    throw err;
  }
}

export async function deleteExpenseById(id) {
  try {
    const saved = localStorage.getItem("expenses");
    const parsed = saved ? JSON.parse(saved) : [];
    const updated = parsed.filter((e) => e.id !== id);
    await saveExpenses(updated);
  } catch (err) {
    console.error("Failed to delete expenses: ", err);
    throw err;
  }
}

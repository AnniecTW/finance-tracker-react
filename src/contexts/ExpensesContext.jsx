import { createContext, useState, useContext, useEffect } from "react";
import {
  fetchExpenses,
  saveExpenses,
  deleteExpenseById,
} from "../expensesService";

const initialExpenses = [
  { id: 1, item: "Lunch", amount: 200 },
  { id: 2, item: "Coffee", amount: 80 },
];

const ExpensesContext = createContext();

function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // initail data loading
  useEffect(() => {
    async function loadExpenses() {
      const data = await fetchExpenses();
      if (data.length === 0) {
        await saveExpenses(initialExpenses);
        setExpenses(initialExpenses);
      } else {
        setExpenses(data);
      }
    }
    loadExpenses();
  }, []);

  // add expense
  async function handleAddExpense(expense) {
    const newExpenses = [...expenses, expense];
    setExpenses(newExpenses);
    await saveExpenses(newExpenses);
  }

  // delete expense, normally, API doesn't return
  async function handleDeleteExpense(id) {
    const updated = await deleteExpenseById(id);
    setExpenses(updated);
  }

  return (
    <ExpensesContext.Provider
      value={{ expenses, handleAddExpense, handleDeleteExpense }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined)
    throw new Error("ExpensesContext was used outside the ExpensesProvider");
  return context;
}

export { ExpensesProvider, useExpenses };

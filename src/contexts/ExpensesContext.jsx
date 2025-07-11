import { createContext, useState, useContext, useEffect } from "react";

const initialExpenses = [
  { id: 1, item: "Lunch", amount: 200 },
  { id: 2, item: "Coffee", amount: 80 },
];

const ExpensesContext = createContext();

function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : initialExpenses;
    }
    return initialExpenses; // initail data loading
  });

  //
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  function handleAddExpense(expense) {
    setExpenses((expenses) => [...expenses, expense]);
  }

  return (
    <ExpensesContext.Provider value={{ expenses, handleAddExpense }}>
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

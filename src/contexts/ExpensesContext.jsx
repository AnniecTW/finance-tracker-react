import { createContext, useReducer, useContext, useEffect } from "react";
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

const initialState = {
  expenses: [],
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "expenses/loaded":
      return { ...state, isLoading: false, expenses: action.payload };

    case "expenses/added":
      return {
        ...state,
        isLoading: false,
        expenses: [...state.expenses, action.payload],
      };

    case "expenses/deleted": {
      // Remove the expense with the given ID
      const updatedExpenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
      if (updatedExpenses.length === state.expenses.length) {
        console.warn("No match expense found for deletion: ", action.payload);
      }
      return { ...state, isLoading: false, expenses: updatedExpenses };
    }

    case "error":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function ExpensesProvider({ children }) {
  const [{ expenses, isLoading }, dispatch] = useReducer(reducer, initialState);

  // initail data loading
  useEffect(() => {
    async function loadExpenses() {
      dispatch({ type: "loading" });
      try {
        const data = await fetchExpenses();
        if (data.length === 0) {
          await saveExpenses(initialExpenses);
          dispatch({ type: "expenses/loaded", payload: initialExpenses });
        } else {
          dispatch({ type: "expenses/loaded", payload: data });
        }
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
      }
    }
    loadExpenses();
  }, []);

  // add expense
  async function handleAddExpense(expense) {
    dispatch({ type: "loading" });
    try {
      const newExpenses = [...expenses, expense];
      await saveExpenses(newExpenses);
      dispatch({ type: "expenses/added", payload: expense });
    } catch (e) {
      dispatch({ type: "error", payload: e.message }); // need update error message by myself later if not get one from API
    }
  }

  // delete expense, normally, API doesn't return
  async function handleDeleteExpense(id) {
    dispatch({ type: "loading" });
    try {
      await deleteExpenseById(id);
      dispatch({ type: "expenses/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  return (
    <ExpensesContext.Provider
      value={{ expenses, isLoading, handleAddExpense, handleDeleteExpense }}
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

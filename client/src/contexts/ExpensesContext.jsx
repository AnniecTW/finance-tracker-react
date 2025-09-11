import { createContext, useReducer, useContext, useEffect } from "react";
import {
  fetchAllExpenses,
  addExpenses,
  deleteExpenseById,
  fetchTodaysExpenses,
  fetchWeeksExpenses,
  fetchMonthsExpenses,
  fetchYearsExpenses,
} from "../services/expensesService";
// const initialExpenses = [
//   { id: 1, item: "Lunch", amount: 200 },
//   { id: 2, item: "Coffee", amount: 80 },
// ];

const ExpensesContext = createContext();

const initialState = {
  allExpenses: [],
  todayExpenses: [],
  weekExpenses: [],
  monthExpenses: [],
  yearExpenses: [],
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "allExpenses/loaded":
      return { ...state, isLoading: false, allExpenses: action.payload };

    case "todayExpenses/loaded":
      return { ...state, isLoading: false, todayExpenses: action.payload };

    case "weekExpenses/loaded":
      return { ...state, isLoading: false, weekExpenses: action.payload };

    case "monthExpenses/loaded":
      return { ...state, isLoading: false, monthExpenses: action.payload };

    case "yearExpenses/loaded":
      return { ...state, isLoading: false, yearExpenses: action.payload };

    case "expenses/added":
      return {
        ...state,
        isLoading: false,
        allExpenses: [...state.allExpenses, action.payload],
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
  const [
    {
      allExpenses,
      todayExpenses,
      weekExpenses,
      monthExpenses,
      yearExpenses,
      isLoading,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Custom hook to fetch and set overview data
  function useOverview(fetchFn, actionType) {
    useEffect(() => {
      async function loadOverview() {
        dispatch({ type: "loading" });
        try {
          const data = await fetchFn();
          dispatch({ type: `${actionType}/loaded`, payload: data });
        } catch (e) {
          dispatch({ type: "error", payload: e.message });
        }
      }
      loadOverview();
    }, []);
  }

  useOverview(fetchAllExpenses, "allExpenses"); // all expenses
  useOverview(fetchTodaysExpenses, "todayExpenses"); // today's expenses
  useOverview(fetchWeeksExpenses, "weekExpenses"); // week's expenses
  useOverview(fetchMonthsExpenses, "monthExpenses"); // month's expenses
  useOverview(fetchYearsExpenses, "yearExpenses"); // year's expenses

  // add expense
  async function handleAddExpense(expense) {
    dispatch({ type: "loading" });
    try {
      const newExpense = await addExpenses(expense);
      console.log("Return new expense：", newExpense);
      dispatch({ type: "expenses/added", payload: newExpense });
      reloadAllOverviews();
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  // delete expense
  async function handleDeleteExpense(id) {
    dispatch({ type: "loading" });
    try {
      await deleteExpenseById(id);
      dispatch({ type: "expenses/deleted", payload: id });
      reloadAllOverviews();
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  // reload all overview data
  async function reloadAllOverviews() {
    try {
      const [allData, todayData, weekData, monthData, yearData] =
        await Promise.all([
          fetchAllExpenses(),
          fetchTodaysExpenses(),
          fetchWeeksExpenses(),
          fetchMonthsExpenses(),
          fetchYearsExpenses(),
        ]);
      dispatch({ type: "allExpenses/loaded", payload: allData });
      dispatch({ type: "todayExpenses/loaded", payload: todayData });
      dispatch({ type: "weekExpenses/loaded", payload: weekData });
      dispatch({ type: "monthExpenses/loaded", payload: monthData });
      dispatch({ type: "yearExpenses/loaded", payload: yearData });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
    }
  }

  return (
    <ExpensesContext.Provider
      value={{
        allExpenses,
        todayExpenses,
        weekExpenses,
        monthExpenses,
        yearExpenses,
        isLoading,
        handleAddExpense,
        handleDeleteExpense,
      }}
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

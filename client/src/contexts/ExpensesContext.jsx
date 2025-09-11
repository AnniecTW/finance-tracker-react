import { createContext, useReducer, useContext, useEffect } from "react";
import {
  fetchTodaysExpenses,
  fetchWeeksExpenses,
  fetchMonthsExpenses,
  fetchYearsExpenses,
} from "../services/expensesService";

const ExpensesContext = createContext();

const initialState = {
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

    case "todayExpenses/loaded":
      return {
        ...state,
        isLoading: false,
        todayExpenses: action.payload,
        error: "",
      };

    case "weekExpenses/loaded":
      return {
        ...state,
        isLoading: false,
        weekExpenses: action.payload,
        error: "",
      };

    case "monthExpenses/loaded":
      return {
        ...state,
        isLoading: false,
        monthExpenses: action.payload,
        error: "",
      };

    case "yearExpenses/loaded":
      return {
        ...state,
        isLoading: false,
        yearExpenses: action.payload,
        error: "",
      };

    case "error":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function ExpensesProvider({ children }) {
  const [
    { todayExpenses, weekExpenses, monthExpenses, yearExpenses, isLoading },
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

  useOverview(fetchTodaysExpenses, "todayExpenses"); // today's expenses
  useOverview(fetchWeeksExpenses, "weekExpenses"); // week's expenses
  useOverview(fetchMonthsExpenses, "monthExpenses"); // month's expenses
  useOverview(fetchYearsExpenses, "yearExpenses"); // year's expenses

  // reload all overview data
  async function reloadAllOverviews() {
    dispatch({ type: "loading" });
    try {
      const [todayData, weekData, monthData, yearData] = await Promise.all([
        fetchTodaysExpenses(),
        fetchWeeksExpenses(),
        fetchMonthsExpenses(),
        fetchYearsExpenses(),
      ]);
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
        todayExpenses,
        weekExpenses,
        monthExpenses,
        yearExpenses,
        isLoading,
        reloadAllOverviews,
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

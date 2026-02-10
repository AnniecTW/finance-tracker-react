import { useQuery } from "@tanstack/react-query";
import {
  getAllExpenses,
  getExpenseById,
  getRecentExpenses,
} from "../../../services/apiTransactions";

export function useAllExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getAllExpenses,
  });
}

export function useExpensesById(id) {
  return useQuery({
    queryKey: ["expenseById", id],
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  });
}

export function useRecentExpenses() {
  return useQuery({
    queryKey: ["expenses", "recent"],
    queryFn: getRecentExpenses,
    staleTime: 5 * 60 * 1000,
  });
}

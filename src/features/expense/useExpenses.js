import { useQuery } from "@tanstack/react-query";
import { getAllExpenses, getExpenseById } from "../../services/apiTransactions";

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

import { useQuery } from "@tanstack/react-query";
import { fetchAllExpenses } from "../services/expensesService";

export function useAllExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchAllExpenses,
  });
}

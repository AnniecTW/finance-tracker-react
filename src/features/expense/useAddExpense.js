import toast from "react-hot-toast";
// import { useExpenses } from "../../contexts/ExpensesContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEditExpense } from "../../services/apiTransactions";

export function useAddExpense({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  // const { reloadAllOverviews } = useExpenses();

  const { mutateAsync, isPending: isAdding } = useMutation({
    mutationFn: addEditExpense,
    onSuccess: () => {
      toast.success("New expense successfully created");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // reloadAllOverviews();
      onSuccess?.();
    },
    onError: (err) => toast.error(err.message),
  });

  return { mutateAsync, isAdding };
}

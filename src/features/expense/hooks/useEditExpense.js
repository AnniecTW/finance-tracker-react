import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEditExpense } from "../../../services/apiTransactions";
import toast from "react-hot-toast";

export function useEditExpense({ setIsEditing }) {
  const queryClient = useQueryClient();

  const { mutate: editExpense, isPending: isEditingExpense } = useMutation({
    mutationFn: ({ data, id }) => addEditExpense(data, id),
    onSuccess: (data, { id }) => {
      toast.success("Expense updated");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseById", id] });
      setIsEditing(false);
    },
  });

  return { editExpense, isEditingExpense };
}

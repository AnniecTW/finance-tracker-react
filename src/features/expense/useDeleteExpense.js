import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpenseById } from "../../services/apiTransactions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useDeleteExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: deleteExpenseById,
    onSuccess: () => {
      toast.success(`Expense successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate("/expenses");
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteExpense, isDeleting };
}

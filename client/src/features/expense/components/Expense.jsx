import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenseById } from "../../../services/expensesService";
import { deleteExpenseById } from "../../../services/expensesService";
import { useNavigate } from "react-router-dom";

function Expense() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch expense data using React Query
  const {
    data: expense,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => fetchExpenseById(id),
    enabled: !!id, // Only run the query if id is available
  });

  // Delete expense
  const queryClient = useQueryClient();
  const { mutate: deleteExpense, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteExpenseById(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate("/expenses");
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading expense. Error: {error.message}</div>;
  if (!expense) return <div>No expense found.</div>;

  return (
    <div>
      <h3>Expense Detail</h3>
      <pre>{JSON.stringify(expense, null, 2)}</pre>
      <button onClick={() => deleteExpense()} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}

export default Expense;

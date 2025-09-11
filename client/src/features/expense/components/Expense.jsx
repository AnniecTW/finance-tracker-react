import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  fetchExpenseById,
  deleteExpenseById,
  updateExpenseById,
} from "../../../services/expensesService";
import { useExpenses } from "../../../contexts/ExpensesContext";
import Button from "../../ui/Button";

function Expense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reloadAllOverviews } = useExpenses();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ item: "", amount: "" });

  // Fetch expense by id
  const {
    data: expense,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => fetchExpenseById(id),
    enabled: !!id, // Only run the query if id is available
  });

  const queryClient = useQueryClient();

  // Edit expense
  const { mutate: editExpense, isLoading: isEditingExpense } = useMutation({
    mutationFn: ({ id, data }) => updateExpenseById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense", id] });
      reloadAllOverviews();
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (expense) {
      setFormData({ item: expense.item || "", amount: expense.amount || "" });
    }
  }, [expense]);

  // Delete expense
  const { mutate: deleteExpense, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteExpenseById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      reloadAllOverviews();
      navigate("/expenses");
    },
  });

  function handleEditSubmit(e) {
    e.preventDefault();
    editExpense({ id, data: formData });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading expense. Error: {error.message}</div>;
  if (!expense) return <div>No expense found.</div>;

  return (
    <div>
      <h3>Detail</h3>
      {isEditing ? (
        <form
          className="editform"
          onSubmit={handleEditSubmit}
          style={{ marginBottom: "1rem" }}
        >
          <label>
            Item:
            <input
              type="text"
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
              required
            />
          </label>
          <label>
            Amout:{" "}
            <input
              type="text"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </label>
          <Button type="submit" disabled={isEditingExpense}>
            {isEditingExpense ? "Saving..." : "Save"}
          </Button>
          <Button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <>
          <p>
            <strong>Item:</strong> {expense.item}
          </p>
          <p>
            <strong>Amount:</strong> ${expense.amount}
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            style={{ marginRight: "1rem" }}
          >
            Edit
          </Button>
          <Button onClick={() => deleteExpense()} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </>
      )}
    </div>
  );
}

export default Expense;

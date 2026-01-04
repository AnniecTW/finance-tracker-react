import { useParams } from "react-router-dom";
import { useState } from "react";
import { useExpensesById } from "../useExpenses";
import { useDeleteExpense } from "../useDeleteExpense";
import { useEditExpense } from "../useEditExpense";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useAddExpense } from "../useAddExpense";
import styles from "./Expense.module.css";

import Button from "../../ui/Button";
import ExpenseForm from "./ExpenseForm";

function Expense() {
  const { id } = useParams();

  // Fetch expense by id
  const { data: expense, isLoading, error } = useExpensesById(id);
  const [isEditing, setIsEditing] = useState(false);

  const { deleteExpense, isDeleting } = useDeleteExpense();
  const { editExpense, isEditingExpense } = useEditExpense({ setIsEditing });

  const { mutateAsync: addExpense, isAdding } = useAddExpense();

  function handleDuplicate() {
    addExpense({
      item: `Copy of ${expense.item}`,
      amount: expense.amount,
      image: expense.image,
      userID: "36a8bcb9-efd6-4be0-880c-d80f95068c3b",
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading expense. Error: {error.message}</div>;
  if (!expense) return <div>No expense found.</div>;

  return (
    <div className={styles.expenseContainer}>
      <h3>Expense Detail</h3>
      {isEditing ? (
        <ExpenseForm
          defaultValues={expense}
          onSubmit={(data) => editExpense({ id, data })}
          isSubmitting={isEditingExpense}
          submitLabel="Save"
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className={styles.detail}>
          <strong>Item:</strong> <span>{expense.item}</span>
          <strong>Amount:</strong> <span>${expense.amount}</span>
          <strong>Category:</strong> <span>{expense.category}</span>
          <strong>Photo</strong>
          <img
            src={
              expense.image && expense.image !== ""
                ? expense.image
                : "/no-photo.jpg"
            }
            alt="expense"
            width="150px"
            onError={(e) => {
              e.target.src = "/no-photo.jpg";
            }}
          />
          <div className="btn-group">
            <Button onClick={handleDuplicate} disabled={isAdding}>
              <HiSquare2Stack />
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              style={{ marginRight: "1rem" }}
            >
              <HiPencil />
            </Button>
            <Button onClick={() => deleteExpense(id)} disabled={isDeleting}>
              <HiTrash />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expense;

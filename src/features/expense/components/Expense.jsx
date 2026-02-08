import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useExpensesById } from "../useExpenses";
import { useDeleteExpense } from "../useDeleteExpense";
import { useEditExpense } from "../useEditExpense";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useAddExpense } from "../useAddExpense";
import styles from "./Expense.module.css";

import Button from "../../ui/Button";
import ExpenseForm from "./ExpenseForm";
import Spinner from "../../ui/Spinner";

import { HiArrowLeft } from "react-icons/hi2";
import AmountDisplay from "../../ui/AmountDisplay";

const typeStyles = {
  income: {
    label: "Income",
    className: styles.tagIncome,
  },
  expense: {
    label: "Expense",
    className: styles.tagExpense,
  },
};

function Expense() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch expense by id
  const { data: expense, isLoading, error } = useExpensesById(id);
  const [isEditing, setIsEditing] = useState(false);

  const { deleteExpense, isDeleting } = useDeleteExpense();
  const { editExpense, isEditingExpense } = useEditExpense({ setIsEditing });

  const { mutateAsync: addExpense, isAdding } = useAddExpense();

  const style = typeStyles[expense?.type];

  function handleDuplicate() {
    const { id, ...dataToCopy } = expense;

    addExpense({
      ...dataToCopy,
      item: `Copy of ${expense.item}`,
      user_id: "36a8bcb9-efd6-4be0-880c-d80f95068c3b",
    });
  }

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading expense. Error: {error.message}</div>;
  if (!expense) return <div>No expense found.</div>;

  return (
    <div className={styles.expenseContainer}>
      <Button
        onClick={() => {
          navigate("/expenses");
        }}
        className={styles.backButton}
      >
        <HiArrowLeft />
      </Button>
      <h3>Detail</h3>
      <span className={`${styles.tag} ${style.className}`}>{style.label}</span>
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
          <strong>Amount:</strong>
          <AmountDisplay amount={expense.amount} type={expense.type} />
          <strong>Category:</strong> <span>{expense.category}</span>
          <strong>Date:</strong>{" "}
          <span>{expense.transaction_date?.split("T")[0]}</span>
          <strong>Notes:</strong>
          <p className={styles.notesContent}>{expense.notes || "---"}</p>
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
          <div className={styles.btnGroup}>
            <Button onClick={handleDuplicate} disabled={isAdding}>
              <HiSquare2Stack />
            </Button>
            <Button onClick={() => setIsEditing(true)}>
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

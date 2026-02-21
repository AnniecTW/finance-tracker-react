import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useUser } from "../../user/useUser";
import { useAddExpense } from "../hooks/useAddExpense";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useEditExpense } from "../hooks/useEditExpense";
import { useExpensesById } from "../hooks/useExpenses";
import styles from "./Expense.module.css";

import Button from "../../ui/Button";
import ExpenseForm from "./ExpenseForm";
import Spinner from "../../ui/Spinner";
import AmountDisplay from "../../ui/AmountDisplay";

import { HiArrowLeft } from "react-icons/hi2";

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
  const { user } = useUser();
  const navigate = useNavigate();

  // Fetch expense by id
  const { data: expense, isLoading, error } = useExpensesById(id);
  const [isEditing, setIsEditing] = useState(false);

  const { deleteExpense, isDeleting } = useDeleteExpense();
  const { editExpense, isEditingExpense } = useEditExpense({ setIsEditing });

  const { mutateAsync: addExpense, isAdding } = useAddExpense();

  const style = typeStyles[expense?.type];

  const expenseDate = new Date(expense?.transaction_date?.replace(/-/g, "/"));

  function handleDuplicate() {
    if (!expense) return;

    const userId = user?.id;
    if (!userId) return;

    const { id: _id, ...dataToCopy } = expense;

    addExpense({
      ...dataToCopy,
      item: `Copy of ${expense.item}`,
      user_id: userId,
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
          <span>{format(expenseDate, "MMM dd, yyyy")}</span>
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
            <Button onClick={handleDuplicate} disabled={isAdding || !user?.id}>
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

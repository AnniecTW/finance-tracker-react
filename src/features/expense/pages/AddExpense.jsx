import ExpenseForm from "../components/ExpenseForm";
import { useAddExpense } from "../useAddExpense";

function AddExpense() {
  const { mutateAsync: addExpense, isAdding } = useAddExpense();
  return (
    <div className="expenseContainer">
      <h2>Add New Expense 💲</h2>
      <ExpenseForm
        onSubmit={(data) =>
          addExpense({
            ...data,
            userID: "36a8bcb9-efd6-4be0-880c-d80f95068c3b",
          })
        }
        isSubmitting={isAdding}
        submitLabel="Add"
      />
    </div>
  );
}

export default AddExpense;

import { useAddExpense } from "../hooks/useAddExpense";
import ExpenseForm from "../components/ExpenseForm";
import styles from "./AddExpense.module.css";

function AddExpense() {
  const { mutateAsync: addExpense, isAdding } = useAddExpense();
  return (
    <section className={styles.addExpenseContainer}>
      <h2>Add New Expense 💲</h2>
      <ExpenseForm
        onSubmit={(data) => addExpense(data)}
        isSubmitting={isAdding}
        submitLabel="Add"
      />
    </section>
  );
}

export default AddExpense;

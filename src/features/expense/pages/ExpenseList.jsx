import { Outlet } from "react-router-dom";
import { useAllExpenses } from "../useExpenses";

import ExpenseItem from "../components/ExpenseItem";
import TotalAmount from "../components/TotalAmount";
import styles from "./ExpenseList.module.css";

function ExpenseList() {
  const { data: allExpenses, isLoading, error } = useAllExpenses();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading expenses. Error: {error.message}</div>;
  if (!allExpenses || allExpenses.length === 0)
    return <div>No expenses found. Start adding some!</div>;

  return (
    <section className={styles.expensesContainer}>
      <ul className={styles.list}>
        <h2>Expense List 📝</h2>
        {allExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
        <TotalAmount />
      </ul>
      <Outlet />
    </section>
  );
}

export default ExpenseList;

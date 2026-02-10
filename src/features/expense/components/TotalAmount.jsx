import { useAllExpenses } from "../hooks/useExpenses";
import styles from "../pages/ExpenseList.module.css";

function TotalAmount() {
  const { data: allExpenses = [] } = useAllExpenses();
  const totalAmount = allExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  return (
    <li className={styles.totalAmount}>
      <strong>Total Amount 💰:</strong> <span>${totalAmount}</span>
    </li>
  );
}

export default TotalAmount;

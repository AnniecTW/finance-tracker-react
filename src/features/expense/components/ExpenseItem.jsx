import { Link } from "react-router-dom";
import styles from "../pages/ExpenseList.module.css";

function ExpenseItem({ expense }) {
  return (
    <li>
      <Link to={`${expense.id}`} className={styles.expenseItem}>
        <strong>Item:</strong> <span>{expense.item}</span>
        <strong>Amount:</strong> <span>${expense.amount}</span>
      </Link>
    </li>
  );
}

export default ExpenseItem;

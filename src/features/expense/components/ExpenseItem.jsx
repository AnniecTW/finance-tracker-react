import { Link } from "react-router-dom";
import styles from "../pages/ExpenseList.module.css";
import AmountDisplay from "../../ui/AmountDisplay";

function ExpenseItem({ expense }) {
  return (
    <li>
      <Link to={`${expense.id}`} className={styles.expenseItem}>
        <strong>Item:</strong> <span>{expense.item}</span>
        <strong>Amount:</strong>
        <AmountDisplay amount={expense.amount} type={expense.type} />
      </Link>
    </li>
  );
}

export default ExpenseItem;

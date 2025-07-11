import { Link } from "react-router-dom";

function ExpenseItem({ expense }) {
  return (
    <li>
      <Link to={`${expense.id}`} className="expenseItem">
        <strong>Item:</strong> <span>{expense.item}</span>
        <strong>Amount:</strong> <span>{expense.amount} NT dollars</span>
      </Link>
    </li>
  );
}

export default ExpenseItem;

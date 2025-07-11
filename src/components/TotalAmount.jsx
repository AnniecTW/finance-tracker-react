import { useExpenses } from "../contexts/ExpensesContext";

function TotalAmount() {
  const { expenses } = useExpenses();
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  return (
    <li className="total-amount">
      <strong>Total Amount 💰:</strong> <span>{totalAmount} NT dollars</span>
    </li>
  );
}

export default TotalAmount;

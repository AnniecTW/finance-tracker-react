import { useExpenses } from "../contexts/ExpensesContext";

function TotalAmount() {
  const { allExpenses } = useExpenses();
  const totalAmount = allExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  return (
    <li className="total-amount">
      <strong>Total Amount 💰:</strong> <span>${totalAmount}</span>
    </li>
  );
}

export default TotalAmount;

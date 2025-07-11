import { Outlet } from "react-router-dom";

import ExpenseItem from "../components/ExpenseItem";
import TotalAmount from "../components/TotalAmount";
import { useExpenses } from "../contexts/ExpensesContext";

function ExpenseList() {
  const { expenses } = useExpenses();
  return (
    <div className="expensesContainer">
      <ul className="list">
        <h2>Expense List 📝</h2>
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
        <TotalAmount expenses={expenses} />
      </ul>
      <div className="detail">
        <Outlet />
      </div>
    </div>
  );
}

export default ExpenseList;

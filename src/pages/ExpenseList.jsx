import { Outlet } from "react-router-dom";

import ExpenseItem from "../components/ExpenseItem";
import TotalAmount from "../components/TotalAmount";
import { useExpenses } from "../contexts/ExpensesContext";

function ExpenseList() {
  const { expenses } = useExpenses();
  return (
    <main>
      <section className="expensesContainer">
        <ul className="list">
          <h2>Expense List 📝</h2>
          {expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
          <TotalAmount />
        </ul>
        <div className="detail">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default ExpenseList;

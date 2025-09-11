import { Outlet } from "react-router-dom";

import ExpenseItem from "../components/ExpenseItem";
import TotalAmount from "../components/TotalAmount";
import { useQuery } from "@tanstack/react-query";
import { fetchAllExpenses } from "../../../services/expensesService";

function ExpenseList() {
  const {
    data: allExpenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchAllExpenses,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading expenses. Error: {error.message}</div>;
  if (!allExpenses || allExpenses.length === 0)
    return <div>No expenses found. Start adding some!</div>;

  return (
    <main>
      <section className="expensesContainer">
        <ul className="list">
          <h2>Expense List 📝</h2>
          {allExpenses.map((expense) => (
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

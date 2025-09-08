import { Link } from "react-router-dom";
import { useExpenses } from "../contexts/ExpensesContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const {
    allExpenses,
    todayExpenses,
    weekExpenses,
    monthExpenses,
    yearExpenses,
  } = useExpenses();
  console.log("All expenses in Dashboard:", allExpenses);
  console.log("Today expenses in Dashboard:", todayExpenses);
  console.log("Week expenses in Dashboard:", weekExpenses);
  console.log("Month expenses in Dashboard:", monthExpenses);
  console.log("Year expenses in Dashboard:", yearExpenses);

  function totalAmount(expenses) {
    return expenses.reduce((sum, expenses) => sum + Number(expenses.amount), 0);
  }

  const AllAmount = totalAmount(allExpenses);
  const TodayAmount = totalAmount(todayExpenses);
  const WeekAmount = totalAmount(weekExpenses);
  const MonthAmount = totalAmount(monthExpenses);
  const YearAmount = totalAmount(yearExpenses);

  return (
    <main>
      <section>
        <h2 className={styles.sumTitle}>Summary</h2>
        <div className={styles.para}>
          <strong>Total Spent:</strong> <span>${AllAmount}</span>
          <strong>Remaining Budget:</strong> <span>$</span>
        </div>

        <div className={styles.para}>
          <h5 className={styles.subSumTitle}>Today:</h5>{" "}
          <span className={styles.span}>${TodayAmount}</span>
          <h5 className={styles.subSumTitle}>This Week:</h5>{" "}
          <span className={styles.span}>${WeekAmount}</span>
          <h5 className={styles.subSumTitle}>This Month:</h5>{" "}
          <span className={styles.span}>${MonthAmount}</span>
          <h5 className={styles.subSumTitle}>This Year:</h5>{" "}
          <span className={styles.span}>${YearAmount}</span>
        </div>
        <div className={styles.link}>
          <Link to="/expenses" className="button">
            View All
          </Link>
          <Link to="/add" className="button">
            + Add Expense
          </Link>
          <Link to="/stats" className="button">
            See Stats
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

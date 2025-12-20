import { Link } from "react-router-dom";
// import { useExpenses } from "../contexts/ExpensesContext";
import { useAllExpenses } from "../features/expense/useExpenses";
import styles from "./Dashboard.module.css";
import Spinner from "../features/ui/Spinner";

function Dashboard() {
  // const { todayExpenses, weekExpenses, monthExpenses, yearExpenses } = useExpenses();
  const { data: allExpenses = [], isLoading, error } = useAllExpenses();

  if (isLoading) {
    return <Spinner />;
  }

  function totalAmount(expenses) {
    return expenses.reduce((sum, expenses) => sum + Number(expenses.amount), 0);
  }

  const AllAmount = totalAmount(allExpenses);
  // const TodayAmount = totalAmount(todayExpenses);
  // const WeekAmount = totalAmount(weekExpenses);
  // const MonthAmount = totalAmount(monthExpenses);
  // const YearAmount = totalAmount(yearExpenses);

  return (
    <section>
      <h2 className={styles.sumTitle}>Summary</h2>
      <div className={styles.para}>
        <strong>Total Spent:</strong> <span>${AllAmount}</span>
        <strong>Remaining Budget:</strong> <span>$</span>
      </div>

      {/* <div className={styles.para}>
        <h5 className={styles.subSumTitle}>Today:</h5>{" "}
        <span className={styles.span}>${TodayAmount}</span>
        <h5 className={styles.subSumTitle}>This Week:</h5>{" "}
        <span className={styles.span}>${WeekAmount}</span>
        <h5 className={styles.subSumTitle}>This Month:</h5>{" "}
        <span className={styles.span}>${MonthAmount}</span>
        <h5 className={styles.subSumTitle}>This Year:</h5>{" "}
        <span className={styles.span}>${YearAmount}</span>
      </div> */}

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
  );
}

export default Dashboard;

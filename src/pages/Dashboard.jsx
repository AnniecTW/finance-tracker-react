import { useMemo } from "react";
import { useAllExpenses } from "../features/expense/useExpenses";

import Button from "../features/ui/Button";
import Spinner from "../features/ui/Spinner";
import styles from "./Dashboard.module.css";

import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  parseISO,
} from "date-fns";

function Dashboard() {
  const { data: allExpenses = [], isLoading } = useAllExpenses();

  const totals = useMemo(() => {
    const now = new Date();

    return allExpenses.reduce(
      (acc, expense) => {
        const expenseDate = parseISO(expense.created_at);
        const amount = Number(expense.amount);

        acc.all += amount;
        if (isSameYear(expenseDate, now)) {
          acc.year += amount;

          if (isSameMonth(expenseDate, now)) {
            acc.month += amount;

            if (isSameDay(expenseDate, now)) {
              acc.today += amount;
            }
          }
        }

        if (isSameWeek(expenseDate, now, { weekStartsOn: 1 })) {
          acc.week += amount;
        }

        return acc;
      },
      { all: 0, year: 0, month: 0, week: 0, today: 0 }
    );
  }, [allExpenses]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <h2 className={styles.sumTitle}>Summary</h2>
      <div className={styles.para}>
        <strong>Total Spent:</strong>
        <span className={styles.span}>${totals.all}</span>
        <strong>Remaining Budget:</strong>
        <span className={styles.span}>$</span>
      </div>

      <div className={styles.para}>
        <h5 className={styles.subSumTitle}>Today:</h5>
        <span className={styles.span}>${totals.today}</span>
        <h5 className={styles.subSumTitle}>This Week:</h5>
        <span className={styles.span}>${totals.week}</span>
        <h5 className={styles.subSumTitle}>This Month:</h5>
        <span className={styles.span}>${totals.month}</span>
        <h5 className={styles.subSumTitle}>This Year:</h5>
        <span className={styles.span}>${totals.year}</span>
      </div>

      <div className={styles.link}>
        <Button to="/expenses">View All</Button>
        <Button to="/add">+ Add Expense</Button>
        <Button to="/stats">See Stats</Button>
      </div>
    </section>
  );
}

export default Dashboard;

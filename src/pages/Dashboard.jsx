import { useMemo } from "react";
import { useAllExpenses } from "../features/expense/useExpenses";

import Button from "../features/ui/Button";
import Spinner from "../features/ui/Spinner";
import styles from "./Dashboard.module.css";

import { TbViewportTall } from "react-icons/tb";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineChartBar } from "react-icons/hi2";

import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  parseISO,
} from "date-fns";
import StatCard from "../features/ui/StatCard";

function Dashboard() {
  const { data: allExpenses = [], isLoading } = useAllExpenses();

  const totals = useMemo(() => {
    const now = new Date();
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayLastMonth = new Date(now.getFullYear, now.getMonth(), 0);

    return allExpenses.reduce(
      (acc, expense) => {
        const expenseDate = parseISO(expense.transaction_date);
        const amount = Number(expense.amount);
        const isIncome = expense.type === "income";

        if (isIncome) acc.income.all += amount;
        else acc.expense.all += amount;

        if (isSameYear(expenseDate, now)) {
          if (isIncome) acc.income.year += amount;
          else acc.expense.year += amount;

          if (isSameMonth(expenseDate, now)) {
            if (isIncome) acc.income.thisMonth += amount;
            else acc.expense.thisMonth += amount;

            if (isSameDay(expenseDate, now)) {
              acc.today += amount;
            }
          }

          if (
            expenseDate >= firstDayLastMonth &&
            expenseDate <= lastDayLastMonth
          ) {
            if (isIncome) acc.income.lastMonth += amount;
            else acc.expense.lastMonth += amount;
          }
        }

        if (isSameWeek(expenseDate, now, { weekStartsOn: 1 })) {
          if (isIncome) acc.income.week += amount;
          else acc.expense.week += amount;
        }

        return acc;
      },
      {
        income: {
          all: 0,
          year: 0,
          thisMonth: 0,
          lastMonth: 0,
          week: 0,
          today: 0,
        },
        expense: {
          all: 0,
          year: 0,
          thisMonth: 0,
          lastMonth: 0,
          week: 0,
          today: 0,
        },
      },
    );
  }, [allExpenses]);

  const totalIncome = totals.income.all;
  const totalExpenses = totals.expense.all;
  const thisMonthIncome = totals.income.thisMonth;
  const lastMonthIncome = totals.income.lastMonth;
  const thisMonthExpense = totals.expense.thisMonth;
  const lastMonthExpense = totals.expense.lastMonth;
  const thisMonthBalance = thisMonthIncome - thisMonthExpense;
  const lastMonthBalance = lastMonthIncome - lastMonthExpense;

  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(0)
      : 0;
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const balaceChange = calculateChange(thisMonthBalance, lastMonthBalance);
  const incomeChange = calculateChange(thisMonthIncome, lastMonthIncome);
  const expenseChange = calculateChange(thisMonthExpense, lastMonthExpense);

  const metrics = [
    { type: "balance", metric: thisMonthBalance, change: balaceChange },
    { type: "income", metric: thisMonthIncome, change: incomeChange },
    { type: "expense", metric: thisMonthExpense, change: expenseChange },
    { type: "savingsRate", metric: savingsRate, change: null },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <h2 className={styles.mainTitle}>Monthly Summary</h2>
      <div className={styles.statsGrid}>
        {metrics.map(({ type, metric, change }, index) => (
          <StatCard key={type} type={type} metric={metric} change={change} />
        ))}
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
        <Button to="/expenses" aria-label="View all expenses">
          <TbViewportTall />
          <span className={styles.btnText}>View All</span>
        </Button>
        <Button to="/add" aria-label="Add a new expense">
          <IoMdAddCircleOutline />
          <span className={styles.btnText}>Add Expense</span>
        </Button>
        <Button to="/stats" aria-label="See Statistics">
          <HiOutlineChartBar />
          <span className={styles.btnText}>See Stats</span>
        </Button>
      </div>
    </section>
  );
}

export default Dashboard;

import { useMemo } from "react";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
} from "date-fns";

const DATE_FMT = "yyyy/MM/dd";

const calculateChange = (current, previous) => {
  if (previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

export function useDashboardStats(allExpenses) {
  return useMemo(() => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const firstDayLastMonth = startOfMonth(lastMonth);
    const lastDayLastMonth = endOfMonth(lastMonth);

    // Core Stats
    const totals = allExpenses.reduce(
      (acc, expense) => {
        if (!expense.transaction_date || !expense.amount) return acc;

        const pureDate = expense.transaction_date.split("T")[0];
        const expenseDate = new Date(pureDate.replace(/-/g, "/"));

        const amount = Number(expense.amount);
        const isIncome = expense.type === "income";
        const target = isIncome ? "income" : "expense";

        acc[target].all += amount;

        if (
          expenseDate >= firstDayLastMonth &&
          expenseDate <= lastDayLastMonth
        ) {
          acc[target].lastMonth += amount;
        }

        if (isSameYear(expenseDate, now)) {
          acc[target].year += amount;

          if (isSameMonth(expenseDate, now)) {
            acc[target].thisMonth += amount;

            if (isSameDay(expenseDate, now)) {
              acc[target].today += amount;
              console.log("找到今天的資料了！", expense);
            }
          }
        }

        if (isSameWeek(expenseDate, now, { weekStartsOn: 1 })) {
          acc[target].week += amount;
        }
        return acc;
      },
      {
        income: {
          all: 0,
          year: 0,
          thisMonth: 0,
          week: 0,
          today: 0,
          lastMonth: 0,
        },
        expense: {
          all: 0,
          year: 0,
          thisMonth: 0,
          week: 0,
          today: 0,
          lastMonth: 0,
        },
      },
    );

    // Derived Stats
    const thisMonthBalance = totals.income.thisMonth - totals.expense.thisMonth;
    const lastMonthBalance = totals.income.lastMonth - totals.expense.lastMonth;
    const savingsRate =
      totals.income.thisMonth > 0
        ? ((thisMonthBalance / totals.income.thisMonth) * 100).toFixed(0)
        : 0;

    // Metrics
    const metrics = [
      {
        metricType: "balance",
        value: thisMonthBalance,
        percentageChange: calculateChange(thisMonthBalance, lastMonthBalance),
      },
      {
        metricType: "income",
        value: totals.income.thisMonth,
        percentageChange: calculateChange(
          totals.income.thisMonth,
          totals.income.lastMonth,
        ),
      },
      {
        metricType: "expense",
        value: totals.expense.thisMonth,
        percentageChange: calculateChange(
          totals.expense.thisMonth,
          totals.expense.lastMonth,
        ),
      },
      { metricType: "savingsRate", value: savingsRate, percentageChange: null },
    ];

    const summaryData = [
      {
        label: "Today",
        dateRange: format(now, DATE_FMT),
        expense: totals.expense.today,
        income: totals.income.today,
      },
      {
        label: "This week",
        dateRange: `${format(startOfWeek(now, { weekStartsOn: 1 }), DATE_FMT)} ~ ${format(endOfWeek(now, { weekStartsOn: 1 }), DATE_FMT)}`,
        expense: totals.expense.week,
        income: totals.income.week,
      },
      {
        label: "This month",
        dateRange: `${format(startOfMonth(now), DATE_FMT)} ~ ${format(endOfMonth(now), DATE_FMT)}`,
        expense: totals.expense.thisMonth,
        income: totals.income.thisMonth,
      },
      {
        label: "This year",
        dateRange: `${format(startOfYear(now), DATE_FMT)} ~ ${format(endOfYear(now), DATE_FMT)}`,
        expense: totals.expense.year,
        income: totals.income.year,
      },
    ];

    return {
      metrics,
      summaryData,
    };
  }, [allExpenses]);
}

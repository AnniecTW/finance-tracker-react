import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { createClient } from "@supabase/supabase-js";
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

interface Transaction {
  transaction_date: string | null;
  amount: number | string | null;
  type: string | null;
  category: string | null;
}

interface Bucket {
  all: number;
  year: number;
  thisMonth: number;
  week: number;
  today: number;
  lastMonth: number;
}

interface Totals {
  income: Bucket;
  expense: Bucket;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const DATE_FMT = "yyyy/MM/dd";

const calculateChange = (
  current: number,
  previous: number,
): number | string => {
  if (previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

const emptyBucket = (): Bucket => ({
  all: 0,
  year: 0,
  thisMonth: 0,
  week: 0,
  today: 0,
  lastMonth: 0,
});

function dashboardStats(allExpenses: Transaction[]) {
  const now = new Date();
  const lastMonth = subMonths(now, 1);
  const firstDayLastMonth = startOfMonth(lastMonth);
  const lastDayLastMonth = endOfMonth(lastMonth);

  const totals = allExpenses.reduce<Totals>(
    (acc, expense) => {
      if (!expense.transaction_date || !expense.amount) return acc;

      const pureDate = expense.transaction_date.split("T")[0];
      const expenseDate = new Date(pureDate.replace(/-/g, "/"));

      const amount = Number(expense.amount);
      const isIncome = expense.type === "income";
      const target: "income" | "expense" = isIncome ? "income" : "expense";

      acc[target].all += amount;

      if (expenseDate >= firstDayLastMonth && expenseDate <= lastDayLastMonth) {
        acc[target].lastMonth += amount;
      }

      if (isSameYear(expenseDate, now)) {
        acc[target].year += amount;

        if (isSameMonth(expenseDate, now)) {
          acc[target].thisMonth += amount;

          if (isSameDay(expenseDate, now)) {
            acc[target].today += amount;
          }
        }
      }

      if (isSameWeek(expenseDate, now, { weekStartsOn: 1 })) {
        acc[target].week += amount;
      }
      return acc;
    },
    { income: emptyBucket(), expense: emptyBucket() },
  );

  const thisMonthBalance = totals.income.thisMonth - totals.expense.thisMonth;
  const lastMonthBalance = totals.income.lastMonth - totals.expense.lastMonth;
  const savingsRate =
    totals.income.thisMonth > 0
      ? ((thisMonthBalance / totals.income.thisMonth) * 100).toFixed(0)
      : 0;

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

  return { metrics, summaryData };
}

app.http("stats", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    try {
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*");

      if (error) throw new Error("transactions could not be fetched");

      const result = dashboardStats((transactions ?? []) as Transaction[]);
      return { jsonBody: result };
    } catch (err) {
      context.log("stats error: ", err);
      return { status: 500, jsonBody: { error: "Failed to load stats" } };
    }
  },
});

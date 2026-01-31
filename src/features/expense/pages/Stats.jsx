import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useAllExpenses } from "../useExpenses";
import styles from "./Stats.module.css";
import dayjs from "dayjs";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

function Stats() {
  const { data: allExpenses = [], isLoading, error } = useAllExpenses();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewType, setViewType] = useState("monthly");

  const unit = viewType === "monthly" ? "month" : "year";
  const dateFormat = viewType === "monthly" ? "MM-DD" : "YYYY-MM";

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, unit));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, unit));
  };

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((item) => {
      const itemDate = dayjs(item.created_at);
      return itemDate.isSame(currentDate, unit);
    });
  }, [allExpenses, currentDate, unit]);

  const { pieData, barData, categories, totalAmount } = useMemo(() => {
    if (!filteredExpenses.length)
      return { pieData: [], barData: [], categories: [], totalAmount: 0 };

    const uniqueCategories = [
      ...new Set(filteredExpenses.map((t) => t.category)),
    ];

    const pieMap = {};
    uniqueCategories.forEach((cat) => (pieMap[cat] = 0));
    let currentTotal = 0;

    const grouped = filteredExpenses.reduce((acc, curr) => {
      pieMap[curr.category] += curr.amount;
      currentTotal += curr.amount;

      const dateKey = dayjs(curr.created_at).format(dateFormat);

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey };
        uniqueCategories.forEach((cat) => (acc[dateKey][cat] = 0));
      }

      acc[dateKey][curr.category] += curr.amount;
      return acc;
    }, {});

    const sortedBarData = Object.values(grouped).sort((a, b) =>
      a.date > b.date ? 1 : -1,
    );

    const formattedPieData = Object.entries(pieMap).map(
      ([name, value], index) => ({
        name,
        value,
        fill: COLORS[index % COLORS.length],
      }),
    );

    return {
      pieData: formattedPieData,
      barData: sortedBarData,
      categories: uniqueCategories,
      totalAmount: currentTotal,
    };
  }, [filteredExpenses, dateFormat]);

  const now = dayjs();
  const isFuture =
    currentDate.isSame(now, unit) || currentDate.isAfter(now, unit);

  const firstExpenseDate =
    allExpenses.length > 0 ? dayjs(allExpenses.at(-1).created_at) : null;
  const isPast =
    firstExpenseDate &&
    (currentDate.isSame(firstExpenseDate, unit) ||
      currentDate.isBefore(firstExpenseDate, unit));

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading expense. Error: {error.message}</div>;

  return (
    <section>
      <h3>Stats 📊 </h3>
      <div className={styles.statsControls}>
        <div className={styles.viewToggle}>
          <Button
            onClick={() => setViewType("monthly")}
            className={viewType === "monthly" ? styles.active : ""}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setViewType("yearly")}
            className={viewType === "yearly" ? styles.active : ""}
          >
            Yearly
          </Button>
        </div>
        <div className={styles.dateNav}>
          <Button onClick={handlePrev} disabled={isPast}>
            {"<"}
          </Button>
          <span className={styles.dateDisplay}>
            {viewType === "monthly"
              ? currentDate.format("YYYY MMMM")
              : currentDate.format("YYYY")}
          </span>
          <Button onClick={handleNext} disabled={isFuture}>
            {">"}
          </Button>
        </div>
      </div>
      {filteredExpenses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            No record {viewType === "monthly" ? "this month" : "this year"} ☕️
          </p>
        </div>
      ) : (
        <div className={styles.chartContainer}>
          <div className={styles.pieContainer}>
            <h5>Category Distribution</h5>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                />
                <Tooltip
                  formatter={(value, name) => {
                    return [`$${value.toLocaleString()}`, name];
                  }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  dy={-15}
                  style={{ fontSize: "1.6rem", fontWeight: "bold" }}
                >{`$${totalAmount.toLocaleString()}`}</text>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.barContainer}>
            <h5>Spending Trend</h5>
            <ResponsiveContainer width="100%" aspect={1.5}>
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 15,
                }}
              >
                <XAxis dataKey="date" />
                <YAxis width="auto" />
                <Tooltip
                  cursor={false}
                  formatter={(value, name) => {
                    return [`$${value.toLocaleString()}`, name];
                  }}
                  labelFormatter={(label, payload) => {
                    const total = payload.reduce(
                      (sum, entry) => sum + entry.value,
                      0,
                    );
                    return `${label} (Total: $${total.toLocaleString()})`;
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                {categories.map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                    background
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}

export default Stats;

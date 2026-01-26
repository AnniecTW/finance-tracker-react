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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

function Stats() {
  const { data: allExpenses = [], isLoading } = useAllExpenses();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewType, setViewType] = useState("monthly");

  const handlePrev = () => {
    const unit = viewType === "monthly" ? "month" : "year";
    setCurrentDate(currentDate.subtract(1, unit));
  };

  const handleNext = () => {
    const unit = viewType === "monthly" ? "month" : "year";
    setCurrentDate(currentDate.add(1, unit));
  };

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((item) => {
      const itemDate = dayjs(item.created_at);
      const unit = viewType === "monthly" ? "month" : "year";
      return itemDate.isSame(currentDate, unit);
    });
  }, [allExpenses, currentDate, viewType]);

  const { pieData, barData, categories } = useMemo(() => {
    if (!filteredExpenses.length)
      return { pieData: [], barData: [], categories: [] };

    const uniqueCategories = [
      ...new Set(filteredExpenses.map((t) => t.category)),
    ];
    const pieMap = {};
    uniqueCategories.forEach((cat) => (pieMap[cat] = 0));

    const grouped = filteredExpenses.reduce((acc, curr) => {
      pieMap[curr.category] += curr.amount;

      const dateObj = dayjs(curr.created_at);

      let dateKey;
      if (viewType === "monthly") {
        dateKey = dateObj.format("MM-DD");
      } else {
        dateKey = dateObj.format("YYYY-MM");
      }

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
    };
  }, [filteredExpenses, viewType, COLORS]);

  return (
    <section>
      <h3>Stats 📊 </h3>
      <button onClick={() => setViewType("monthly")}>Monthly</button>
      <button onClick={() => setViewType("yearly")}>Yearly</button>
      <div>
        <button onClick={handlePrev}>{"<"}</button>
        <span>
          {viewType === "monthly"
            ? currentDate.format("YYYY MMMM")
            : currentDate.format("YYYY")}
        </span>
        <button onClick={handleNext}>{">"}</button>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.pieContainer}>
          <h4>Category Distribution</h4>
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.barContainer}>
          <h4>Spending Trend</h4>
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
    </section>
  );
}

export default Stats;

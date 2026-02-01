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
import { useStatsData } from "../useStatsData";
import styles from "./Stats.module.css";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

const COLORS = ["#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef"];

function Stats() {
  const { data: allExpenses = [], isLoading, error } = useAllExpenses();

  const {
    currentDate,
    viewType,
    setViewType,
    handlePrev,
    handleNext,
    filteredExpenses,
    isFuture,
    isPast,
    pieData,
    barData,
    categories,
    totalAmount,
    chartAspect,
    windowWidth,
    formatXAxis,
  } = useStatsData(allExpenses, COLORS);

  const pieCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const textAnchor = x > cx ? "start" : "end";

    return (
      <text
        x={x}
        y={y}
        fill="var(--clr-body-text)"
        textAnchor={textAnchor}
        dominantBaseline="central"
      >
        <tspan x={x} dy="-0.6em" fontweight="600" fontSize="16px">
          {name}
        </tspan>
        <tspan x={x} dy="1.4em" fontSize="14px">
          ${value}
        </tspan>
      </text>
    );
  };

  // handling pie size
  const isMobile = windowWidth < 600;
  const outerRadius = isMobile ? 70 : 90;
  const innerRadius = isMobile ? 50 : 60;

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading expense. Error: {error.message}</div>;

  return (
    <section>
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
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  paddingAngle={5}
                  label={pieCustomizedLabel}
                />
                <Tooltip
                  formatter={(value, name) => {
                    return [`$${value.toLocaleString()}`, name];
                  }}
                />
                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
                >
                  Total Expense
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >{`$${totalAmount.toLocaleString()}`}</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.barContainer}>
            <h5>Spending Trend</h5>
            <ResponsiveContainer width="100%" aspect={chartAspect}>
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 50,
                }}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: "inherit" }}
                  interval={0}
                />
                <YAxis width="auto" tickLine={false} />
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
                />
                <Legend
                  wrapperStyle={{
                    position: "relative",
                    top: "5px",
                  }}
                />
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

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
  } = useStatsData(allExpenses, COLORS);

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
                  style={{ fontSize: "1.6rem", fontWeight: "bold" }}
                >{`$${totalAmount.toLocaleString()}`}</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.barContainer}>
            <h5>Spending Trend</h5>
            <ResponsiveContainer width="100%" aspect={0.9}>
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

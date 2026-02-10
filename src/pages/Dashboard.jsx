import { useAllExpenses } from "../features/expense/hooks/useExpenses";
import { useDashboardStats } from "../hooks/useDashboardStats";

import Button from "../features/ui/Button";
import Spinner from "../features/ui/Spinner";
import styles from "./Dashboard.module.css";

import { TbViewportTall } from "react-icons/tb";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineChartBar } from "react-icons/hi2";

import StatCard from "../features/ui/StatCard";
import SummaryRow from "../features/ui/SummaryRow";

function Dashboard() {
  const { data: allExpenses = [], isLoading } = useAllExpenses();
  console.log(allExpenses.length);
  const { metrics, summaryData } = useDashboardStats(allExpenses);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <h2 className={styles.mainTitle}>Monthly Summary</h2>
      <div className={styles.statsGrid}>
        {metrics.map(({ metricType, value, percentageChange }) => (
          <StatCard
            key={metricType}
            metricType={metricType}
            value={value}
            percentageChange={percentageChange}
          />
        ))}
      </div>
      <SummaryRow summaryData={summaryData} />

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

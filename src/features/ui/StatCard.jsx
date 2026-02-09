import { MdOutlineSavings, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import styles from "./StatCard.module.css";

function StatCard({ type, metric, change }) {
  console.log((type, metric));
  const METRICS_LABEL = {
    balance: "Total Balance",
    income: "Total Income",
    expense: "Total Expenses",
    savingsRate: "Savings Rate",
  };

  const isNotSavingsRate = type !== "savingsRate";

  return (
    <div className={styles.statCard}>
      <div className={styles.cardInfo}>
        <p className={styles.label}>{METRICS_LABEL[type]}</p>
        <h3
          className={styles.amount}
        >{` ${isNotSavingsRate ? `$${metric.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : `${metric}%`}`}</h3>
        <span
          className={`${styles.trend} ${isNotSavingsRate ? (change >= 0 ? styles.up : styles.down) : ""}`}
        >
          {isNotSavingsRate ? (change >= 0 ? "↑" : "↓") : ""} {change}
          <small>
            {isNotSavingsRate ? "vs last month" : "of income saved"}
          </small>
        </span>
      </div>
      <div className={styles.iconBox}>
        {isNotSavingsRate ? (
          metric >= 0 ? (
            <MdTrendingUp />
          ) : (
            <MdTrendingDown />
          )
        ) : (
          <MdOutlineSavings />
        )}
      </div>
    </div>
  );
}

export default StatCard;

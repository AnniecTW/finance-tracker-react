import { MdOutlineSavings, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import styles from "./StatCard.module.css";

const METRIC_DISPLAY_NAMES = {
  balance: "Total Balance",
  income: "Total Income",
  expense: "Total Expenses",
  savingsRate: "Savings Rate",
};

function StatCard({ metricType, value, percentageChange }) {
  const isCurrency = metricType !== "savingsRate";
  const numericChange = Number(percentageChange);

  const getTrendConfig = () => {
    if (!isCurrency) {
      return { icon: <MdOutlineSavings />, className: "", text: "" };
    }

    if (numericChange === 0) {
      return { icon: <TbMoneybag />, className: "", text: "0%" };
    }

    const isUp = numericChange > 0;

    return {
      icon: isUp ? <MdTrendingUp /> : <MdTrendingDown />,
      className: isUp ? styles.up : styles.down,
      text: `${isUp ? "↑" : "↓"} ${Math.abs(numericChange)}%`,
    };
  };

  const { icon, className, text } = getTrendConfig();

  return (
    <div className={styles.statCard}>
      <div className={styles.cardInfo}>
        <p className={styles.label}>{METRIC_DISPLAY_NAMES[metricType]}</p>
        <h3
          className={styles.amount}
        >{` ${isCurrency ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : `${value}%`}`}</h3>
        <span className={`${styles.trend} ${className}`}>
          {text}
          <small>{isCurrency ? "vs last month" : "of income saved"}</small>
        </span>
      </div>
      <div className={styles.iconBox}>{icon}</div>
    </div>
  );
}

export default StatCard;

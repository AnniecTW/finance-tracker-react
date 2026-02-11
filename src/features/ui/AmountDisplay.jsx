import styles from "./AmountDisplay.module.css";

function AmountDisplay({ amount, type }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(amount);

  return (
    <div className={styles.valueWrapper}>
      <span
        className={`${styles.symbol} ${type === "income" ? styles.plus : ""}`}
      >
        {type === "expense" ? "-" : "+"}
      </span>
      <span className={styles.currency}>$</span>
      <span className={styles.number}>{formattedAmount}</span>
    </div>
  );
}

export default AmountDisplay;

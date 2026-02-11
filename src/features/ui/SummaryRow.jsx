import AmountDisplay from "./AmountDisplay";
import styles from "./SummaryRow.module.css";

function SummaryRow({ summaryData }) {
  return (
    <div className={styles.summaryContainer}>
      {summaryData.map((item) => (
        <div key={item.label} className={styles.summaryRow}>
          <div className={styles.leftPart}>
            <span className={styles.badge}>{item.label}</span>
            <span className={styles.dateRange}>{item.dateRange}</span>
          </div>
          <div className={styles.rightPart}>
            <div className={styles.expenseValue}>
              <AmountDisplay type="expense" amount={item.expense} />
            </div>
            <div className={styles.incomeValue}>
              <AmountDisplay type="income" amount={item.income} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryRow;

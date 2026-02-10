import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAllExpenses } from "../hooks/useExpenses";
import ExpenseItem from "../components/ExpenseItem";
import TotalAmount from "../components/TotalAmount";
import Spinner from "../../ui/Spinner";
import styles from "./ExpenseList.module.css";

function ExpenseList() {
  const { id } = useParams();
  const { data: allExpenses, isLoading, error } = useAllExpenses();

  const isMobile = window.innerWidth <= 768;
  const variants = {
    initial: {
      opacity: 0,
      x: isMobile ? "-100%" : 0,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: isMobile ? "-100%" : 0,
    },
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading expenses. Error: {error.message}</div>;
  if (!allExpenses || allExpenses.length === 0)
    return <div>No expenses found. Start adding some!</div>;

  return (
    <section className={styles.expensesContainer}>
      <ul className={styles.list}>
        <h2>Expense List</h2>
        {allExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
        <TotalAmount />
      </ul>
      <div className={styles.detailContainer}>
        <AnimatePresence mode="wait">
          {id && (
            <motion.div
              key={id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ExpenseList;

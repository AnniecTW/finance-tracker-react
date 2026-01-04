import { NavLink } from "react-router-dom";
import User from "../user/components/User";
import styles from "./PageNav.module.css";

function PageNav() {
  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink to="/dashboard" className={styles.navLink}>
            Dashboard
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/expenses" className={styles.navLink}>
            My Expenses
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/add" className={styles.navLink}>
            Add Expenses
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/stats" className={styles.navLink}>
            Statistics
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <User />
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;

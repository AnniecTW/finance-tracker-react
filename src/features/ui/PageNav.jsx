import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import {
  HiOutlineHome,
  HiOutlineTable,
  HiOutlinePlusCircle,
  HiOutlineChartPie,
} from "react-icons/hi";

function PageNav() {
  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink to="/dashboard" className={styles.navLink}>
            <HiOutlineHome className={styles.icon} />
            <span className={styles.navLabel}>Dashboard</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/expenses" className={styles.navLink}>
            <HiOutlineTable className={styles.icon} />
            <span className={styles.navLabel}>Expenses</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/add" className={styles.navLink}>
            <HiOutlinePlusCircle className={styles.icon} />
            <span className={styles.navLabel}>Add</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/stats" className={styles.navLink}>
            <HiOutlineChartPie className={styles.icon} />
            <span className={styles.navLabel}>Statistics</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;

import { Outlet } from "react-router-dom";

import PageNav from "../features/ui/PageNav";
import styles from "./AppLayout.module.css";
import User from "../features/user/components/User";

function AppLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <PageNav />
        <User />
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

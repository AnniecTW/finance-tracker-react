import { Outlet } from "react-router-dom";

import PageNav from "../features/ui/PageNav";
import Footer from "../features/ui/Footer";
import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <div className={styles.layout}>
      <PageNav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;

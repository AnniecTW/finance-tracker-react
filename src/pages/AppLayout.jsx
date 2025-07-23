import { Outlet } from "react-router-dom";

import PageNav from "../components/PageNav";
import Footer from "../components/Footer";

function AppLayout() {
  return (
    <div className="layout">
      <PageNav />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;

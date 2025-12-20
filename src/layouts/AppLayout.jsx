import { Outlet } from "react-router-dom";

import PageNav from "../features/ui/PageNav";
import Footer from "../features/ui/Footer";

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

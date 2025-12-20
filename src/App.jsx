import ProtectedRoute from "./features/user/pages/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { useAuthRedirect } from "./hooks/useAuthRedirect";

import AddExpense from "./features/expense/pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import ExpenseList from "./features/expense/pages/ExpenseList";
import Expense from "./features/expense/components/Expense";
import Stats from "./features/expense/pages/Stats";
import Account from "./features/user/pages/Account";
import Spinner from "./features/ui/Spinner";
import SpinnerFullPage from "./features/ui/SpinnerFullPage";

const Homepage = lazy(() => import("./features/home/pages/Homepage"));
const Login = lazy(() => import("./features/user/pages/Login"));
const Signup = lazy(() => import("./features/user/pages/Signup"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  useAuthRedirect();

  return (
    <>
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/expenses" element={<ExpenseList />}>
              <Route path=":id" element={<Expense />} />
            </Route>
            <Route path="/stats" element={<Stats />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: { duration: 5000 },
          style: {
            fontSize: "18px",
            maxWidth: "500px",
            padding: "8px 12px",
            backgroundColor: "#F5F5F0",
            color: "#333",
          },
        }}
      />
    </>
  );
}

export default App;

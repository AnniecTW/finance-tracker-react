import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExpensesProvider } from "./contexts/ExpensesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./features/user/pages/ProtectedRoute";

import AddExpendrse from "./features/expense/pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import ExpenseList from "./features/expense/pages/ExpenseList";
import Expense from "./features/expense/components/Expense";
import Stats from "./features/expense/pages/Stats";
import Spinner from "./features/ui/Spinner";
import SpinnerFullPage from "./features/ui/SpinnerFullPage";

const Homepage = lazy(() => import("./features/home/pages/Homepage"));
const Login = lazy(() => import("./features/user/pages/Login"));
const Signup = lazy(() => import("./features/user/pages/Signup"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <AuthProvider>
      <ExpensesProvider>
        <BrowserRouter>
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
                <Route path="/add" element={<AddExpendrse />} />
                <Route path="/expenses" element={<ExpenseList />}>
                  <Route path=":id" element={<Expense />} />
                </Route>
                <Route path="/stats" element={<Stats />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ExpensesProvider>
    </AuthProvider>
  );
}

export default App;

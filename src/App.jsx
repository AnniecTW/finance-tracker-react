import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddExpense from "./pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import ExpenseList from "./pages/ExpenseList";
import Expense from "./components/Expense";
import PageNotFound from "./pages/PageNotFound";
import { ExpensesProvider } from "./contexts/ExpensesContext";
import "./App.css";

function App() {
  return (
    <ExpensesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="expenses" element={<ExpenseList />}>
            <Route path=":id" element={<Expense />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ExpensesProvider>
  );
}

export default App;

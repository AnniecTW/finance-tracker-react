import { Link } from "react-router-dom";
import Button from "../components/Button";

function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
      <Link to="expenses" className="button">
        Expense History
      </Link>
      <Link to="add" className="button">
        + Add Expense
      </Link>
    </div>
  );
}

export default Dashboard;

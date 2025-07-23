import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main>
      <section>
        <h2>July Summary</h2>
        <p>Total Spent: $6,230</p>
        <p>Remaining Budget: $770</p>
        <div>
          <h5>Today</h5>
          <h5>This Week</h5>
          <h5>This Month</h5>
          <h5>This Year</h5>
        </div>
        <Link to="/expenses" className="button">
          View All
        </Link>
        <Link to="/add" className="button">
          + Add Expense
        </Link>
        <Link to="/stats" className="button">
          See Stats
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;

import { NavLink } from "react-router-dom";
import User from "./user";

function PageNav() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <NavLink to="/dashboard" className="navLink">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/expenses" className="navLink">
            My Expenses
          </NavLink>
        </li>
        <li>
          <NavLink to="/add" className="navLink">
            Add Expenses
          </NavLink>
        </li>
        <li>
          <NavLink to="/stats" className="navLink">
            Statistics
          </NavLink>
        </li>
        <li>
          <User />
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;

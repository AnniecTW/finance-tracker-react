import { Link } from "react-router-dom";
import styles from "./Button.module.css";

function Button({
  type = "button",
  to,
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  if (to) {
    return (
      <Link to={to} className={`${styles.button} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

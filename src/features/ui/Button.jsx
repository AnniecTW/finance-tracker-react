import { Link } from "react-router-dom";
import styles from "./Button.module.css";

function Button({
  type = "button",
  to,
  variation = "secondary",
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  const variantClass = styles[variation] || styles.primary;
  const fullClassName = `${styles.button} ${variantClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={fullClassName}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={fullClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

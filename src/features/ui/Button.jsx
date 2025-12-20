function Button({
  type = "button",
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

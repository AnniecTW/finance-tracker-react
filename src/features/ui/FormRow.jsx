import styles from "./FormRow.module.css";

function FormRow({ label, error, children, className, id }) {
  const htmlID = id || children?.props?.id;
  return (
    <div className={`${styles.formRow} ${className || ""}`}>
      {label && <label htmlFor={htmlID}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default FormRow;

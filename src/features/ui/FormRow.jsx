function FormRow({ label, error, children }) {
  return (
    <div className="form-row">
      {label && <label htmlFor={children.props.id}>{label}</label>}
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default FormRow;

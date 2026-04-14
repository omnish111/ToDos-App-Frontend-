function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  ...props
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className={`form-input ${error ? "is-invalid" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

export default Input;

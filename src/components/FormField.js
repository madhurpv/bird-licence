import "./FormField.css";

export default function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  hint,
  mono,
}) {
  return (
    <div className="form-field">
      <label className="ff-label">{label}</label>
      {type === "select" ? (
        <select
          className="ff-input ff-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={`ff-input ${mono ? "ff-mono" : ""}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <span className="ff-hint">{hint}</span>}
    </div>
  );
}

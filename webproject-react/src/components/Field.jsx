export function Field({ label, name, value = '', error = null, onChange }) {
  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        // Якщо є помилка, додаємо модифікатор БЕМ
        className={`field__input ${error ? 'field__input--error' : ''}`}
        value={value}
        onChange={onChange}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
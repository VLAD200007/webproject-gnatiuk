export function SearchField({ value, onChange }) {
  return (
    <div className="search-field" style={{ marginBottom: '15px' }}>
      <input
        type="text"
        className="field__input"
        placeholder="Пошук матеріалів..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export function CategoryFilter({ categories, currentCategory, onChange }) {
  return (
    <div className="category-filter" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      {categories.map(cat => (
        <button
          key={cat}
          // Якщо категорія активна, даємо primary, якщо ні - secondary
          className={`button ${currentCategory === cat ? 'button--primary' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat === '' ? 'Всі' : cat}
        </button>
      ))}
    </div>
  );
}
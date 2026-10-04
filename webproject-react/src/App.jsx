import { MaterialList } from './components/MaterialList';

// Масив-заглушка з даними
const mockData = [
  { id: 1, title: 'JavaScript для початківців', author: 'Ілля Кантор', category: 'Програмування' },
  { id: 2, title: 'Дизайн інтерфейсів', author: 'Алан Купер', category: 'Дизайн' },
  { id: 3, title: 'Чистий код', author: 'Роберт Мартін', category: 'Програмування' }
];

function App() {
  return (
    <>
      <header className="header" style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <h1>Лабораторна робота №9</h1>
      </header>

      <main style={{ padding: '20px' }}>
        <h2>Каталог матеріалів</h2>
        {/* Передаємо наш масив у компонент списку */}
        <MaterialList items={mockData} />
      </main>

      <footer className="footer" style={{ padding: '20px', borderTop: '1px solid #ccc', marginTop: '20px' }}>
        <p>© 2026 Гнатюк В. Група 5-ІПБ</p>
      </footer>
    </>
  );
}

export default App;
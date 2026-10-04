import { useState } from 'react';
import { MaterialList } from './components/MaterialList';
import { SearchField } from './components/SearchField';
import { CategoryFilter } from './components/CategoryFilter';
import { Modal } from './components/Modal';
import { ContactForm } from './components/ContactForm';

const mockData = [
  { id: 1, title: 'JavaScript для початківців', author: 'Ілля Кантор', category: 'Програмування' },
  { id: 2, title: 'Дизайн інтерфейсів', author: 'Алан Купер', category: 'Дизайн' },
  { id: 3, title: 'Чистий код', author: 'Роберт Мартін', category: 'Програмування' }
];

const CATEGORIES = ['', 'Програмування', 'Дизайн'];

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('success'); 
  
  // 2. Стан відкритого запису (null - закрито, об'єкт - відкрито)
  const [activeRecord, setActiveRecord] = useState(null);

  const filteredData = mockData.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === '' || item.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <header className="header" style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <h1>Лабораторна робота №10</h1>
      </header>

      <main style={{ padding: '20px' }}>
        <h2>Каталог матеріалів</h2>
        
        <SearchField value={query} onChange={setQuery} />
        <CategoryFilter categories={CATEGORIES} currentCategory={category} onChange={setCategory} />

        {/* 3. Передаємо setActiveRecord в MaterialList */}
        <MaterialList items={filteredData} status={status} onOpen={setActiveRecord} />
        
        {/* Додаємо нашу форму зворотного зв'язку */}
        <ContactForm />
      </main>

      {/* 4. Умовний рендеринг модального вікна */}
      {activeRecord && (
        <Modal 
          record={activeRecord} 
          onClose={() => setActiveRecord(null)} 
        />
      )}
    </>
  );
}

export default App;
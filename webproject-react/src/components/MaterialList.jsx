import { Card } from './Card';
import { Alert } from './Alert';

// Додали проп onOpen
export function MaterialList({ items, status, onOpen }) { 
  if (status === 'loading') return <div className="skeleton">⏳ Завантаження матеріалів...</div>;
  if (status === 'error') return <Alert variant="error">❌ Сталася помилка під час завантаження даних!</Alert>;
  if (items.length === 0) return <Alert variant="warning">📭 За вашим запитом нічого не знайдено.</Alert>;

  return (
    <div className="list">
      {items.map(item => (
        <Card 
          key={item.id} 
          title={item.title} 
          author={item.author} 
          category={item.category} 
          // Викликаємо функцію з об'єктом поточного запису
          onOpen={() => onOpen(item)} 
        />
      ))}
    </div>
  );
}
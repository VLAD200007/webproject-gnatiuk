import { Card } from './Card';

export function MaterialList({ items }) {
  if (!items || items.length === 0) {
    return <p>Немає записів для відображення.</p>;
  }

  return (
    <div className="list">
      {items.map(item => (
        <Card 
          key={item.id}
          title={item.title} 
          author={item.author} 
          category={item.category} 
          onOpen={() => console.log('Відкрито запис:', item)}
        />
      ))}
    </div>
  );
}
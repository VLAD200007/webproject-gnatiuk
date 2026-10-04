import { useEffect } from 'react';
import { Button } from './Button';

export function Modal({ record, onClose }) {
  // 1. Закриття по клавіші Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Очищення слухача
  }, [onClose]);

  // Якщо запису немає, взагалі нічого не малюємо
  if (!record) return null;

  // 2. Закриття по кліку на підкладку (overlay)
  const handleOverlayClick = (e) => {
    // Перевіряємо, що клікнули саме по темному фону, а не по самій картці всередині
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleOverlayClick} style={overlayStyle}>
      <div className="modal__dialog" style={dialogStyle}>
        <header className="modal__header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 className="modal__title">{record.title}</h3>
          {/* 3. Закриття по кнопці */}
          <button className="modal__close" onClick={onClose} style={{ cursor: 'pointer' }}>✖</button>
        </header>
        <div className="modal__body" style={{ margin: '15px 0' }}>
          <p><strong>Автор:</strong> {record.author}</p>
          <p><strong>Категорія:</strong> {record.category}</p>
          <p>Детальний опис матеріалу... (тут міг би бути ваш текст)</p>
        </div>
        <div className="modal__footer">
          <Button onClick={onClose} variant="secondary">Закрити</Button>
        </div>
      </div>
    </div>
  );
}

// Прості стилі, щоб вікно виглядало як модальне, якщо їх немає в твоєму SCSS
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const dialogStyle = {
  backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '350px'
};
import { materials } from './data/materials.js';
import { Store } from './services/store.js';
import { renderList } from './ui/renderList.js';

// 1. Створюємо сховище з нашими даними
const store = new Store(materials);

// 2. Отримуємо впорядкований за абеткою перелік
const sortedItems = store.sortedByTitle();

// 3. Знаходимо контейнер на сторінці та вставляємо розмітку
const container = document.getElementById('catalog');
if (container) {
  // Щоб картки виводилися сіткою, контейнер в index.html 
  // повинен мати відповідні стилі (наприклад, display: flex; gap: 20px;)
  container.innerHTML = renderList(sortedItems);
}

// 4. Виводимо статистику категорій у консоль (для перевірки)
console.log('Статистика за категоріями:', store.countByCategory());
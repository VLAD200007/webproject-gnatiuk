import { Material } from '../models/Material.js';

export class Store {
  #items = [];

  constructor(items) {
    // Створюємо масив екземплярів класу Material з об'єктів-заглушок
    this.#items = items.map(Material.fromObject);
  }

  // Повертає поверхневу копію всього масиву
  all() {
    return [...this.#items];
  }

  // Фільтрація за пошуковим запитом (використовує метод matches з класу Material)
  search(query) {
    return this.#items.filter(item => item.matches(query));
  }

  // Фільтрація за категорією
  byCategory(category) {
    return this.#items.filter(item => item.category === category);
  }

  // Пошук одного запису за ідентифікатором
  byId(id) {
    return this.#items.find(item => item.id === id);
  }

  // Сортування за назвою (за алфавітом української мови), без зміни оригіналу
  sortedByTitle() {
    return [...this.#items].sort((a, b) => a.title.localeCompare(b.title, 'uk'));
  }

  // Підрахунок кількості книг у кожній категорії
  countByCategory() {
    return this.#items.reduce((acc, item) => {
      // Якщо категорія вже є в акумуляторі — збільшуємо на 1, якщо ні — ініціалізуємо 1
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }
}
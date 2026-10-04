export class Material {
  // Приватне поле для захисту ідентифікатора
  #id;

  // Конструктор із полями сутності Книги (з ПР2)
  constructor({ id, title, author, description, category, date, downloads }) {
    this.#id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.category = category;
    this.date = date;
    this.downloads = downloads;
  }

  // Геттер до приватного поля
  get id() {
    return this.#id;
  }

  // Метод перевірки відповідності пошуковому запиту
  matches(query) {
    const q = query.toLowerCase();
    // Шукаємо або в назві книги, або в імені автора
    return this.title.toLowerCase().includes(q) || this.author.toLowerCase().includes(q);
  }

  // Змістовний метод предметної області (чи є книга новинкою)
  isNew(days = 30) {
    const itemDate = new Date(this.date);
    const now = new Date();
    const diffTime = Math.abs(now - itemDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  // Статичний метод для створення екземпляра з об'єкта
  static fromObject(obj) {
    return new Material(obj);
  }
}

// Похідний клас через extends (Рекомендована книга)
export class FeaturedMaterial extends Material {
  constructor(data, highlightBadge = 'Хіт сезону') {
    // Виклик конструктора батьківського класу
    super(data);
    this.highlightBadge = highlightBadge;
  }

  // Перевизначення методу з викликом super
  matches(query) {
    // Перевіряємо, чи є збіг у базовому класі (назва або автор)
    const baseMatch = super.matches(query);
    // Додатково перевіряємо, чи не шукає користувач за текстом мітки
    const badgeMatch = this.highlightBadge.toLowerCase().includes(query.toLowerCase());
    
    return baseMatch || badgeMatch;
  }
}
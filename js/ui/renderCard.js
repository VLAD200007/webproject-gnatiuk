export function renderCard(item) {
  return `
    <article class="card">
      <div class="card__title">${item.title}</div>
      <div class="card__text">
        <p><strong>Автор:</strong> ${item.author}</p>
        <p><strong>Категорія:</strong> ${item.category}</p>
        <p>${item.description}</p>
      </div>
      <div class="card__footer">
        <button class="button button--primary" data-id="${item.id}">Детальніше</button>
      </div>
    </article>
  `;
}
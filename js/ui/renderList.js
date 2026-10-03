import { renderCard } from './renderCard.js';

export function renderList(items) {
  if (!items || items.length === 0) {
    return `<div class="alert alert--warning">Нічого не знайдено</div>`;
  }
  
  return items.map(renderCard).join('');
}
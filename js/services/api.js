import { Material } from '../models/Material.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Перетворювач даних із захисним читанням (?. та ??)
export function toMaterial(raw) {
  return new Material({
    id: raw?.id ?? Date.now(),
    title: raw?.title ?? 'Без назви',
    author: raw?.userId ? `Автор №${raw.userId}` : 'Невідомий автор',
    description: raw?.body ?? 'Опис відсутній',
    category: raw?.id % 2 === 0 ? 'Програмування' : 'Дизайн',
    date: '2026-09-01',
    downloads: (raw?.id ?? 1) * 50
  });
}

// Отримання даних з API
export async function getMaterials() {
  const data = await request('/posts?_limit=8');
  return data.map(toMaterial);
}
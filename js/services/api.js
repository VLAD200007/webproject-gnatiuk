import { Material } from '../models/Material.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const CACHE_KEY = 'api_materials_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 хвилин

let abortController = null;

async function request(path, options = {}) {
  // 1. Перевірка мережі (Offline)
  if (!navigator.onLine) {
    throw new Error('OFFLINE');
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  
  // 2. Обробка статусів (Види відмов)
  if (!response.ok) {
    if (response.status === 404) throw new Error('404');
    if (response.status === 401 || response.status === 403) throw new Error('AUTH');
    if (response.status >= 500) throw new Error('SERVER');
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

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

// Функція отримання даних із підтримкою пошуку (query), скасування та кешу
export async function getMaterials(query = '', forceRefresh = false) {
  // Скасування попереднього запиту, якщо він ще виконується
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  // Перевірка кешу (тільки якщо немає пошукового запиту і не примусове оновлення)
  if (!forceRefresh && !query) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data.map(toMaterial); // Повертаємо з кешу
      }
    }
  }

  try {
    // Формуємо шлях. Якщо є query - шукаємо на сервері (через параметр q)
    const path = query ? `/posts?_limit=8&q=${encodeURIComponent(query)}` : `/posts?_limit=8`;
    
    const data = await request(path, { signal: abortController.signal });
    
    // Зберігаємо в кеш (тільки базовий список без фільтрів)
    if (!query) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    }

    return data.map(toMaterial);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Попередній запит скасовано');
      throw error; // Перекидаємо далі, але перехопимо в main.js
    }
    throw error;
  }
}
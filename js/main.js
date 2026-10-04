import { getMaterials } from './services/api.js';
import { Store } from './services/store.js';
import { renderList } from './ui/renderList.js';
import { validateForm } from './utils/validate.js';

let store = null;
const container = document.getElementById('catalog');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');

// Розширений об'єкт стану з трьома станами (loading, success, error)
let state = {
  status: 'loading', // 'loading' | 'success' | 'error'
  items: [],
  error: null,
  query: '',
  category: ''
};

// Функція рендерингу залежно від стану інтерфейсу
function render() {
  if (state.status === 'loading') {
    container.innerHTML = `<div class="alert alert--warning" role="status" style="margin: 20px;">Завантаження даних каталогу з мережі...</div>`;
    return;
  }
  
  if (state.status === 'error') {
    container.innerHTML = `<div class="alert alert--error" role="alert" style="margin: 20px;">Помилка завантаження: ${state.error.message}. Спробуйте пізніше.</div>`;
    return;
  }

  // Якщо статус success — працює сховище та фільтри
  if (store) {
    let list = store.search(state.query);
    if (state.category) {
      list = list.filter(m => m.category === state.category);
    }
    container.innerHTML = renderList(list);
  }
}

// Асинхронне завантаження даних із API
async function loadData() {
  state.status = 'loading';
  render();
  
  try {
    const rawMaterials = await getMaterials();
    store = new Store(rawMaterials); // Передаємо дані у Store
    state.items = rawMaterials;
    state.status = 'success';
  } catch (error) {
    state.error = error;
    state.status = 'error';
  }
  
  render();
}

// Пошук та фільтрація
searchInput.addEventListener('input', (event) => {
  state = { ...state, query: event.target.value };
  render();
});

categoryFilters.addEventListener('click', (event) => {
  if (event.target.tagName !== 'BUTTON') return;
  state = { ...state, category: event.target.dataset.cat };
  render();
});

// Запуск завантаження при старті
loadData();


// --- Делегування та Модальне вікно ---
const modal = document.getElementById('book-modal');
let lastFocusedElement = null;

container.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="open"]');
  if (!btn || !store) return;

  const id = Number(btn.dataset.id);
  const book = store.byId(id);
  
  if (book) {
    lastFocusedElement = btn; 
    document.getElementById('modal-title').textContent = book.title;
    document.getElementById('modal-author').textContent = `Автор: ${book.author}`;
    document.getElementById('modal-desc').textContent = book.description;
    
    modal.classList.add('modal--open');
    modal.querySelector('.modal__close').focus();
  }
});

function closeModal() {
  modal.classList.remove('modal--open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
    closeModal();
  }
});


// --- Валідація форми ---
const form = document.getElementById('suggest-form');
const formAlert = document.getElementById('form-alert');

form.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') {
    const field = e.target.closest('.field');
    field.classList.remove('field--invalid');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.querySelectorAll('.field').forEach(f => f.classList.remove('field--invalid'));
  formAlert.style.display = 'none';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const errors = validateForm(data);

  if (Object.keys(errors).length > 0) {
    let firstErrorField = null;
    for (const [fieldName, errorMsg] of Object.entries(errors)) {
      const input = form.querySelector(`[name="${fieldName}"]`);
      const field = input.closest('.field');
      field.classList.add('field--invalid');
      field.querySelector('.field__error').textContent = errorMsg;
      if (!firstErrorField) firstErrorField = input;
    }
    if (firstErrorField) firstErrorField.focus();
  } else {
    console.log('Дані форми:', data);
    formAlert.className = 'alert alert--success';
    formAlert.textContent = 'Дякуємо! Ваша пропозиція успішно надіслана.';
    formAlert.style.display = 'block';
    form.reset();
  }
});
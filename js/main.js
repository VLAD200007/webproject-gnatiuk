import { getMaterials } from './services/api.js';
import { Store } from './services/store.js';
import { renderList } from './ui/renderList.js';
import { validateForm } from './utils/validate.js';
import { debounce } from './utils/debounce.js';

let store = null;
const container = document.getElementById('catalog');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');

// --- 1. Відновлення стану з вебсховища (sessionStorage) ---
const savedState = JSON.parse(sessionStorage.getItem('app_state')) || {};
let state = {
  status: 'loading', // 'loading' | 'success' | 'error'
  items: [],
  error: null,
  query: savedState.query || '',
  category: savedState.category || ''
};

// Відновлюємо значення в UI
searchInput.value = state.query;

// Функція збереження стану
function saveState() {
  sessionStorage.setItem('app_state', JSON.stringify({ query: state.query, category: state.category }));
}

// Форматування повідомлення про помилку
function getErrorMessage(errorMsg) {
  if (errorMsg === 'OFFLINE') return 'Немає підключення до інтернету. Перевірте мережу.';
  if (errorMsg === '404') return 'Дані не знайдено на сервері (Помилка 404).';
  if (errorMsg === 'AUTH') return 'Немає доступу до ресурсу (Помилка авторизації).';
  if (errorMsg === 'SERVER') return 'Внутрішня помилка сервера. Спробуйте пізніше.';
  return `Помилка завантаження: ${errorMsg}`;
}

// --- 2. Функція рендерингу ---
function render() {
  if (state.status === 'loading') {
    container.innerHTML = `<div class="alert alert--warning" role="status" style="margin: 20px;">Завантаження даних каталогу з мережі...</div>`;
    return;
  }
  
  if (state.status === 'error') {
    container.innerHTML = `
      <div class="alert alert--error" role="alert" style="margin: 20px;">
        ${getErrorMessage(state.error.message)}
        <br><button id="retry-btn" class="button button--primary" style="margin-top: 10px;">Спробувати ще раз</button>
      </div>`;
      
    // Обробник для кнопки повтору
    document.getElementById('retry-btn')?.addEventListener('click', () => loadData(state.query));
    return;
  }

  // Якщо статус success — працює сховище та фільтри
  if (store) {
    let list = store.search(state.query);
    if (state.category) {
      list = list.filter(m => m.category === state.category);
    }
    
    // Стан порожнього результату (не помилка!)
    if (list.length === 0) {
      container.innerHTML = `<div class="alert alert--warning" style="margin: 20px;">За вашим запитом нічого не знайдено.</div>`;
    } else {
      container.innerHTML = renderList(list);
    }
  }
}

// --- 3. Асинхронне завантаження даних із API ---
async function loadData(searchQuery = '', force = false) {
  state.status = 'loading';
  render();
  
  try {
    const rawMaterials = await getMaterials(searchQuery, force);
    store = new Store(rawMaterials); // Передаємо дані у Store
    state.items = rawMaterials;
    state.status = 'success';
  } catch (error) {
    // Ігноруємо AbortError, щоб не блимала помилка при швидкому наборі
    if (error.name === 'AbortError') return; 
    
    state.error = error;
    state.status = 'error';
  }
  
  render();
}

// --- 4. Пошук та фільтрація (з Debounce) ---
const handleSearch = debounce((query) => {
  state.query = query;
  saveState();
  loadData(query); // Робимо реальний запит на сервер при пошуку
}, 300);

searchInput.addEventListener('input', (event) => {
  handleSearch(event.target.value);
});

categoryFilters.addEventListener('click', (event) => {
  if (event.target.tagName !== 'BUTTON') return;
  state.category = event.target.dataset.cat;
  saveState();
  render(); // Категорії фільтруємо локально, не смикаємо API
});

// --- 5. Кнопки оновлення та скидання фільтрів ---
const controlsHtml = `
  <div style="margin: 20px 0;">
    <button id="force-update-btn" class="button button--secondary" style="margin-right: 10px;">Оновити примусово (ігнорувати кеш)</button>
    <button id="reset-filters-btn" class="button button--secondary">Скинути фільтри</button>
  </div>
`;
categoryFilters.insertAdjacentHTML('afterend', controlsHtml);

document.getElementById('force-update-btn').addEventListener('click', () => {
  loadData(state.query, true);
});

document.getElementById('reset-filters-btn').addEventListener('click', () => {
  state.query = '';
  state.category = '';
  searchInput.value = '';
  sessionStorage.removeItem('app_state');
  loadData();
});

// Запуск завантаження при старті
loadData(state.query);


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
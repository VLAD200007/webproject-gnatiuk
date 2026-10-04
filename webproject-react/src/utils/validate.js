export function validate(form) {
  const errors = {};
  
  if (!form.name || form.name.trim() === '') {
    errors.name = "Введіть ім'я";
  }
  
  if (!form.email || !form.email.includes('@')) {
    errors.email = "Введіть коректну пошту";
  }
  
  if (!form.message || form.message.trim() === '') {
    errors.message = "Введіть повідомлення";
  }
  
  return errors;
}

// Дублюємо у вигляді default, щоб помилка зникла за будь-якого імпорту
export default validate;
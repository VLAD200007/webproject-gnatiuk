export function validateForm(data) {
  const errors = {};

  if (!data.userName || data.userName.length < 2) {
    errors.userName = "Ім'я має містити мінімум 2 символи.";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.userEmail || !emailRegex.test(data.userEmail)) {
    errors.userEmail = "Введіть коректний email.";
  }

  if (!data.bookTitle || data.bookTitle.length < 3) {
    errors.bookTitle = "Назва має містити мінімум 3 символи.";
  } else if (!/^[А-ЯA-ZІЇЄҐ]/.test(data.bookTitle)) {
    errors.bookTitle = "Назва книги має починатися з великої літери."; // Специфічне правило
  }

  if (!data.reason || data.reason.length < 10) {
    errors.reason = "Опишіть причину детальніше (мінімум 10 символів).";
  }

  return errors;
}
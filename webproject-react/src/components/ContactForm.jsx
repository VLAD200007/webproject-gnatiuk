import { useState } from 'react';
import { Field } from './Field';
import { Button } from './Button';
import { Alert } from './Alert';
// Підключаємо твій модуль валідації з ПР6 (перевір, чи правильний шлях до файлу)
import validate from '../utils/validate';

export function ContactForm() {
  // 1. Стан усіх полів форми одним об'єктом (як вимагається)
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  
  // 2. Помилки зберігаємо окремим станом
  const [errors, setErrors] = useState({});
  
  // Стан для відображення повідомлення про успіх
  const [success, setSuccess] = useState(false);

  // 3. Обробник змін (як вимагається в завданні)
  const handleChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // 4. Очищення помилки конкретного поля під час його редагування
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 5. Виклик функції валідації без її зміни
    const validationErrors = validate(form);
    
    if (Object.keys(validationErrors || {}).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      // Очищення форми після успішної відправки
      setForm({ name: '', email: '', message: '' }); 
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: '40px', maxWidth: '400px' }}>
      <h3>Зворотний зв'язок</h3>
      
      {/* 6. Повідомлення про успіх */}
      {success && (
        <div style={{ marginBottom: '15px' }}>
          <Alert variant="success">✅ Повідомлення успішно відправлено!</Alert>
        </div>
      )}

      {/* 7. Передача помилок у компонент Field через властивість error */}
      <Field 
        label="Ваше ім'я" 
        name="name" 
        value={form.name} 
        error={errors.name} 
        onChange={(e) => handleChange('name')(e.target.value)} 
      />
      
      <Field 
        label="Електронна пошта" 
        name="email" 
        value={form.email} 
        error={errors.email} 
        onChange={(e) => handleChange('email')(e.target.value)} 
      />
      
      <Field 
        label="Повідомлення" 
        name="message" 
        value={form.message} 
        error={errors.message} 
        onChange={(e) => handleChange('message')(e.target.value)} 
      />
      
      <div style={{ marginTop: '15px' }}>
        <Button type="submit">Відправити</Button>
      </div>
    </form>
  );
}
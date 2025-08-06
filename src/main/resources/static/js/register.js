// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Валидация
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showError('Будь ласка, заповніть всі поля');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Будь ласка, введіть коректний email');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showError('Будь ласка, введіть коректний номер телефону (+380XXXXXXXXX)');
        return;
    }
    
    if (password.length < 6) {
        showError('Пароль повинен містити мінімум 6 символів');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Паролі не співпадають');
        return;
    }
    
    // Здесь будет отправка данных на сервер
    console.log('Реєстрація:', { firstName, lastName, email, phone, password });
    
    // Имитация успешной регистрации
    showSuccess('Реєстрація успішна!');
    setTimeout(() => {
        window.location.href = '/'; // Перенаправление на главную
    }, 1000);
});

// Google Sign-Up
function signUpWithGoogle() {
    // Здесь будет интеграция с Google OAuth
    console.log('Реєстрація через Google');
    
    // Имитация Google регистрации
    showSuccess('Реєстрація через Google успішна!');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация номера телефона (украинский формат)
function isValidPhone(phone) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
}

// Автоматическое форматирование номера телефона
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Убираем все кроме цифр
    
    if (value.length > 0 && !value.startsWith('380')) {
        value = '380' + value;
    }
    
    if (value.length > 0) {
        value = '+' + value;
    }
    
    e.target.value = value;
});

// Показать ошибку
function showError(message) {
    // Удаляем предыдущие сообщения
    removeMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #fee;
        color: #c33;
        padding: 12px;
        border-radius: 8px;
        margin: 10px 0;
        font-size: 14px;
        border: 1px solid #fcc;
    `;
    
    document.querySelector('.login-form').appendChild(errorDiv);
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Показать успех
function showSuccess(message) {
    // Удаляем предыдущие сообщения
    removeMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'message success';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: #efe;
        color: #3c3;
        padding: 12px;
        border-radius: 8px;
        margin: 10px 0;
        font-size: 14px;
        border: 1px solid #cfc;
    `;
    
    document.querySelector('.login-form').appendChild(successDiv);
}

// Удалить все сообщения
function removeMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

// Добавить анимацию для кнопок
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.login-btn, .google-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Создаем эффект ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Добавить CSS для анимации ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 
// Обработка формы входа
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Валидация
    if (!email || !password) {
        showError('Будь ласка, заповніть всі поля');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Будь ласка, введіть коректний email');
        return;
    }
    
    // Показываем индикатор загрузки
    const submitBtn = this.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Завантаження...';
    submitBtn.disabled = true;
    
    try {
        // Отправляем запрос на сервер
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.message);
            // Сохраняем данные пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => {
                window.location.href = '/'; // Перенаправление на главную
            }, 1000);
        } else {
            // Обработка различных типов ошибок
            if (data.message && data.message.includes('Невірний email або пароль')) {
                showError('Невірний email або пароль. Перевірте правильність введених даних.');
            } else if (data.message && data.message.includes('не існує')) {
                showError('Користувача з таким email не знайдено. Перевірте email або зареєструйтесь.');
            } else {
                showError(data.message || 'Помилка входу. Спробуйте ще раз.');
            }
        }
        
    } catch (error) {
        console.error('Ошибка при входе:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Помилка з\'єднання з сервером. Перевірте інтернет-з\'єднання.');
        } else {
            showError('Помилка сервера. Спробуйте пізніше.');
        }
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Google Sign-In
function signInWithGoogle() {
    // Здесь будет интеграция с Google OAuth
    console.log('Вхід через Google');
    
    // Имитация Google входа
    showSuccess('Вхід через Google успішний!');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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
        animation: slideIn 0.3s ease-out;
    `;
    
    document.querySelector('.login-form').appendChild(errorDiv);
    
    // Автоматически скрыть через 8 секунд (больше времени для чтения)
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 8000);
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
        animation: slideIn 0.3s ease-out;
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

// Добавить CSS для анимации ripple и slideIn
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 
// Обработка формы входа с Firebase
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
        // Вход через Firebase
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        showSuccess('Успішний вхід!');
        
        // Дополнительные данные пользователя будут сохранены в firebase-config.js
        setTimeout(() => {
            window.location.href = '/'; // Перенаправление на главную
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при входе:', error);
        
        // Обработка различных типов ошибок Firebase
        let errorMessage = 'Помилка входу. Спробуйте ще раз.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'Користувача з таким email не знайдено. Перевірте email або зареєструйтесь.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Невірний пароль. Перевірте правильність введених даних.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Невірний формат email. Перевірте правильність введення.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Цей аккаунт був деактивований. Зверніться до підтримки.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Забагато невдалих спроб. Спробуйте пізніше.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Помилка з\'єднання з сервером. Перевірте інтернет-з\'єднання.';
                break;
        }
        
        showError(errorMessage);
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Google Sign-In с Firebase
document.getElementById('googleSignInBtn').addEventListener('click', async function() {
    try {
        const result = await firebaseAuth.signInWithGoogle();
        const user = result.user;
        
        showSuccess('Успішний вхід через Google!');
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при входе через Google:', error);
        
        let errorMessage = 'Помилка входу через Google. Спробуйте ще раз.';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Вікно авторизації було закрито. Спробуйте ще раз.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Вікно авторизації було заблоковано браузером. Дозвольте спливаючі вікна для цього сайту.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Операція була скасована. Спробуйте ще раз.';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = 'Аккаунт з таким email вже існує з іншим методом авторизації.';
                break;
        }
        
        showError(errorMessage);
    }
});

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
    
    // Автоматически скрыть через 8 секунд
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
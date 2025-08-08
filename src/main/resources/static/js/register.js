// Обработка формы регистрации с Firebase
document.getElementById('registerForm').addEventListener('submit', async function(e) {
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
    
    // Показываем индикатор загрузки
    const submitBtn = this.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Завантаження...';
    submitBtn.disabled = true;
    
    try {
        // Регистрация через Firebase
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Обновляем профиль пользователя с дополнительными данными
        await user.updateProfile({
            displayName: `${firstName} ${lastName}`,
            photoURL: null
        });
        
        // Сохраняем дополнительные данные на сервере
        await saveUserDataToServer(user.uid, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            displayName: `${firstName} ${lastName}`
        });
        
        showSuccess('Реєстрація успішна!');
        
        setTimeout(() => {
            window.location.href = '/'; // Перенаправление на главную
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        
        // Обработка различных типов ошибок Firebase
        let errorMessage = 'Помилка реєстрації. Спробуйте ще раз.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Користувач з таким email вже існує. Спробуйте увійти або використайте інший email.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Невірний формат email. Перевірте правильність введення.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Пароль занадто слабкий. Використайте мінімум 6 символів.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Реєстрація через email/пароль не дозволена. Зверніться до адміністратора.';
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

// Google Sign-Up с Firebase
document.getElementById('googleSignUpBtn').addEventListener('click', async function() {
    try {
        const result = await firebaseAuth.signInWithGoogle();
        const user = result.user;
        
        // Сохраняем данные пользователя на сервере
        await saveUserDataToServer(user.uid, {
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email,
            phone: '',
            displayName: user.displayName,
            photoURL: user.photoURL
        });
        
        showSuccess('Реєстрація через Google успішна!');
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при регистрации через Google:', error);
        
        let errorMessage = 'Помилка реєстрації через Google. Спробуйте ще раз.';
        
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

// Функция для сохранения данных пользователя на сервере
async function saveUserDataToServer(uid, userData) {
    try {
        const token = await firebaseAuth.getCurrentUser().getIdToken();
        
        const response = await fetch('/api/users/firebase-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                uid: uid,
                ...userData
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            console.error('Ошибка сохранения данных пользователя:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при сохранении данных пользователя:', error);
    }
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
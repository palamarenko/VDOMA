// Функции для управления статусом пользователя

// Проверка авторизации пользователя
function checkUserAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateHeaderForLoggedUser(userData);
        return true;
    } else {
        updateHeaderForGuest();
        return false;
    }
}

// Обновление хедера для авторизованного пользователя
function updateHeaderForLoggedUser(userData) {
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        // Получаем имя пользователя из разных возможных источников
        let userName = 'Користувач';
        
        if (userData.displayName) {
            userName = userData.displayName;
        } else if (userData.firstName && userData.lastName) {
            userName = `${userData.firstName} ${userData.lastName}`;
        } else if (userData.firstName) {
            userName = userData.firstName;
        } else if (userData.email) {
            // Используем email как fallback
            userName = userData.email.split('@')[0];
        }
        
        headerRight.innerHTML = `
            <div class="user-info">
                <span class="user-name">${userName}</span>
                <button class="btn btn-secondary" onclick="performLogout()">Вийти</button>
            </div>
        `;
    }
}

// Обновление хедера для гостя
function updateHeaderForGuest() {
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        headerRight.innerHTML = `
            <a href="/register" class="btn btn-secondary">Зарееструватись</a>
            <a href="/login" class="btn btn-secondary">Ввійти в аккаунт</a>
        `;
    }
}

// Выход пользователя
function performLogout() {
    // Используем глобальную функцию выхода из Firebase
    if (window.firebaseLogout) {
        window.firebaseLogout();
    } else {
        // Fallback для случаев без Firebase
        localStorage.removeItem('user');
        updateHeaderForGuest();
        window.location.reload();
    }
}

// Получение данных текущего пользователя
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
});

// Добавление стилей для информации о пользователе
const userStyles = document.createElement('style');
userStyles.textContent = `
    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .user-name {
        color: white;
        font-size: 14px;
        font-weight: 500;
    }
`;
document.head.appendChild(userStyles); 
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
        headerRight.innerHTML = `
            <div class="user-info">
                <span class="user-name">${userData.firstName} ${userData.lastName}</span>
                <button class="btn btn-secondary" onclick="logout()">Вийти</button>
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
function logout() {
    localStorage.removeItem('user');
    updateHeaderForGuest();
    window.location.reload();
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
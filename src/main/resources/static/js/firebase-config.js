// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyCIZ5akBwl1PwXkGxwSBI83m2550CEHJXM",
    authDomain: "vdoma-fcab8.firebaseapp.com",
    projectId: "vdoma-fcab8",
    storageBucket: "vdoma-fcab8.firebasestorage.app",
    messagingSenderId: "917880779035",
    appId: "1:917880779035:web:40529270a4f34040bc23be",
    measurementId: "G-Q3VZVEQQE5"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Получаем экземпляр аутентификации
const auth = firebase.auth();

// Настройка Google провайдера
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Слушатель состояния аутентификации
auth.onAuthStateChanged(function(user) {
    if (user) {
        console.log('Пользователь вошел в систему:', user.email);
        
        // Извлекаем имя и фамилию из displayName
        let firstName = '';
        let lastName = '';
        
        if (user.displayName) {
            const nameParts = user.displayName.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }
        
        // Сохраняем данные пользователя
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            firstName: firstName,
            lastName: lastName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Обновляем интерфейс если мы на главной странице
        if (typeof updateHeaderForLoggedUser === 'function') {
            updateHeaderForLoggedUser(userData);
        }
        
        // Отправляем токен на сервер для верификации
        user.getIdToken().then(token => {
            verifyTokenWithServer(token);
        });
    } else {
        console.log('Пользователь вышел из системы');
        localStorage.removeItem('user');
        
        // Обновляем интерфейс если мы на главной странице
        if (typeof updateHeaderForGuest === 'function') {
            updateHeaderForGuest();
        }
    }
});

// Функция для верификации токена на сервере
async function verifyTokenWithServer(token) {
    try {
        const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('Токен верифицирован на сервере');
        } else {
            console.error('Ошибка верификации токена:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при верификации токена:', error);
    }
}

// Глобальные функции для аутентификации
window.firebaseAuth = {
    signInWithEmailAndPassword: (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    },
    
    createUserWithEmailAndPassword: (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    },
    
    signInWithGoogle: () => {
        return auth.signInWithPopup(googleProvider);
    },
    
    signOut: () => {
        return auth.signOut();
    },
    
    getCurrentUser: () => {
        return auth.currentUser;
    },
    
    onAuthStateChanged: (callback) => {
        return auth.onAuthStateChanged(callback);
    }
};

// Глобальная функция выхода для совместимости
window.firebaseLogout = function() {
    auth.signOut().then(() => {
        console.log('Выход из Firebase выполнен');
        localStorage.removeItem('user');
        
        // Обновляем интерфейс
        if (typeof updateHeaderForGuest === 'function') {
            updateHeaderForGuest();
        }
        
        // Перезагружаем страницу
        window.location.reload();
    }).catch((error) => {
        console.error('Ошибка при выходе из Firebase:', error);
    });
};

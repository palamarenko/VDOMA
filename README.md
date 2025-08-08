# VDOMA.ua - Проект с Firebase Authentication

## Описание

Веб-приложение для поиска и бронирования жилья с интегрированной системой аутентификации Firebase.

## Технологии

- **Backend**: Spring Boot 4.0, Kotlin, JPA, H2 Database
- **Frontend**: HTML, CSS, JavaScript, Thymeleaf
- **Аутентификация**: Firebase Authentication
- **Сборка**: Gradle

## Быстрый старт

### 1. Клонирование проекта

```bash
git clone <repository-url>
cd demo
```

### 2. Настройка Firebase

1. Следуйте инструкциям в файле [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Получите конфигурацию Firebase и обновите `src/main/resources/static/js/firebase-config.js`
3. Скачайте файл сервисного аккаунта и сохраните как `firebase-service-account.json` в корне проекта

### 3. Запуск приложения

```bash
# Сборка проекта
./gradlew build

# Запуск приложения
./gradlew bootRun
```

Приложение будет доступно по адресу: http://localhost:8080

### 4. Тестирование

1. Откройте http://localhost:8080/register
2. Попробуйте зарегистрироваться через Firebase
3. Проверьте вход через http://localhost:8080/login

## Структура проекта

```
demo/
├── src/main/
│   ├── kotlin/com/example/demo/
│   │   ├── back/
│   │   │   ├── config/
│   │   │   │   └── FirebaseConfig.kt
│   │   │   ├── controller/
│   │   │   │   ├── UserController.kt
│   │   │   │   └── FirebaseAuthController.kt
│   │   │   ├── model/
│   │   │   │   └── UserModel.kt
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.kt
│   │   │   └── service/
│   │   │       ├── UserService.kt
│   │   │       └── FirebaseAuthService.kt
│   │   └── DemoApplication.kt
│   └── resources/
│       ├── static/
│       │   ├── css/
│       │   ├── js/
│       │   │   ├── firebase-config.js
│       │   │   ├── login.js
│       │   │   └── register.js
│       │   └── templates/
│       │       ├── login.html
│       │       └── register.html
│       └── application.properties
├── build.gradle.kts
├── FIREBASE_SETUP.md
└── README.md
```

## Основные функции

### Аутентификация
- Регистрация через email/пароль
- Регистрация через Google
- Вход через email/пароль
- Вход через Google
- Верификация токенов Firebase на сервере

### Безопасность
- Валидация данных на клиенте и сервере
- Обработка ошибок Firebase
- Безопасное хранение токенов
- Защита от CORS атак

## API Endpoints

### Аутентификация
- `POST /api/auth/verify-token` - Верификация Firebase токена
- `POST /api/auth/register-firebase-user` - Регистрация Firebase пользователя

### Пользователи
- `POST /api/users/register` - Регистрация пользователя (legacy)
- `POST /api/users/firebase-register` - Регистрация Firebase пользователя
- `POST /api/users/login` - Вход пользователя (legacy)
- `GET /api/users/check-email` - Проверка существования email

## Конфигурация

### База данных
Приложение использует H2 in-memory базу данных. Данные сохраняются между запусками в файле `data.mv.db`.

### Firebase
Для работы с Firebase необходимо:
1. Создать проект в Firebase Console
2. Включить Authentication
3. Настроить провайдеры (Email/Password, Google)
4. Получить конфигурацию и сервисный аккаунт

## Разработка

### Добавление новых функций
1. Создайте модель в `back/model/`
2. Создайте репозиторий в `back/repository/`
3. Создайте сервис в `back/service/`
4. Создайте контроллер в `back/controller/`
5. Добавьте frontend компоненты

### Тестирование
```bash
./gradlew test
```

## Проблемы и решения

### Ошибка "Firebase not initialized"
- Проверьте правильность конфигурации в `firebase-config.js`
- Убедитесь, что Firebase SDK загружен

### Ошибка "Invalid token"
- Проверьте файл сервисного аккаунта
- Убедитесь, что проект Firebase настроен правильно

### Ошибка базы данных
- Удалите файл `data.mv.db` для сброса базы данных
- Проверьте миграции схемы

## Лицензия

MIT License

## Поддержка

При возникновении проблем создайте issue в репозитории проекта.

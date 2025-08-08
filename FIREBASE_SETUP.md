# Настройка Firebase Authentication

## Шаги для настройки Firebase в проекте

### 1. Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Authentication в разделе "Authentication" → "Sign-in method"
4. Включите Email/Password и Google провайдеры

### 2. Получение конфигурации Firebase

1. В Firebase Console перейдите в "Project Settings" (шестеренка)
2. В разделе "Your apps" добавьте веб-приложение
3. Скопируйте конфигурацию Firebase

### 3. Обновление конфигурации в проекте

Замените конфигурацию в файле `src/main/resources/static/js/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "ВАШ_API_KEY",
    authDomain: "ВАШ_PROJECT_ID.firebaseapp.com",
    projectId: "ВАШ_PROJECT_ID",
    storageBucket: "ВАШ_PROJECT_ID.appspot.com",
    messagingSenderId: "ВАШ_SENDER_ID",
    appId: "ВАШ_APP_ID"
};
```

### 4. Настройка Firebase Admin SDK

1. В Firebase Console перейдите в "Project Settings" → "Service accounts"
2. Нажмите "Generate new private key"
3. Скачайте JSON файл с ключом
4. Сохраните файл как `firebase-service-account.json` в корне проекта

### 5. Настройка переменных окружения

Создайте файл `application.properties` или добавьте в существующий:

```properties
# Firebase Admin SDK
spring.firebase.credentials.path=classpath:firebase-service-account.json
```

### 6. Обновление конфигурации Firebase для backend

Обновите файл `src/main/kotlin/com/example/demo/back/config/FirebaseConfig.kt`:

```kotlin
@Configuration
class FirebaseConfig {

    @Bean
    @Throws(IOException::class)
    fun firebaseApp(): FirebaseApp {
        if (FirebaseApp.getApps().isEmpty()) {
            val serviceAccount = ClassPathResource("firebase-service-account.json").inputStream
            val credentials = GoogleCredentials.fromStream(serviceAccount)
            
            val options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build()
            return FirebaseApp.initializeApp(options)
        } else {
            return FirebaseApp.getInstance()
        }
    }

    @Bean
    fun firebaseAuth(): FirebaseAuth {
        return FirebaseAuth.getInstance()
    }
}
```

### 7. Настройка базы данных

Запустите приложение для создания новых таблиц с полями для Firebase:

```sql
-- Добавьте новые поля в таблицу users
ALTER TABLE users ADD COLUMN firebase_uid VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN photo_url VARCHAR(500);
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;
```

### 8. Тестирование

1. Запустите приложение
2. Перейдите на страницу регистрации
3. Попробуйте зарегистрироваться через Firebase
4. Проверьте вход через Firebase

## Важные замечания

1. **Безопасность**: Никогда не коммитьте `firebase-service-account.json` в репозиторий
2. **Домены**: Добавьте ваш домен в Firebase Console → Authentication → Settings → Authorized domains
3. **CORS**: Настройте CORS для вашего домена в Firebase Console
4. **Обработка ошибок**: Код уже включает обработку основных ошибок Firebase

## Структура изменений

### Frontend изменения:
- `login.html` - добавлен Firebase SDK
- `register.html` - добавлен Firebase SDK  
- `firebase-config.js` - конфигурация Firebase
- `login.js` - обновлен для работы с Firebase
- `register.js` - обновлен для работы с Firebase

### Backend изменения:
- `FirebaseConfig.kt` - конфигурация Firebase Admin SDK
- `FirebaseAuthService.kt` - сервис для работы с Firebase
- `FirebaseAuthController.kt` - контроллер для Firebase аутентификации
- `UserModel.kt` - добавлены поля для Firebase
- `UserService.kt` - добавлены методы для Firebase пользователей
- `UserRepository.kt` - добавлены методы для поиска по Firebase UID
- `UserController.kt` - добавлен endpoint для регистрации Firebase пользователей

## Возможные проблемы и решения

1. **Ошибка CORS**: Добавьте домен в Firebase Console
2. **Ошибка токена**: Проверьте правильность конфигурации Firebase
3. **Ошибка базы данных**: Убедитесь, что все поля созданы в таблице
4. **Ошибка Google Sign-In**: Проверьте настройки OAuth в Firebase Console

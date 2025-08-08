package com.example.demo.back.service

import com.example.demo.back.model.UserModel
import com.example.demo.back.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class UserService(
    private val userRepository: UserRepository
) {
    
    // Регистрация нового пользователя
    fun registerUser(
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        password: String
    ): UserModel {
        
        // Валидация входных данных
        validateRegistrationData(firstName, lastName, email, phone, password)
        
        // Проверяем, не существует ли уже пользователь с таким email
        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("Користувач з таким email вже існує")
        }
        
        // Создаем нового пользователя
        val user = UserModel(
            firstName = firstName.trim(),
            lastName = lastName.trim(),
            email = email.trim().lowercase(),
            phone = phone.trim(),
            password = password, // В реальном проекте здесь должно быть хеширование пароля
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        
        return userRepository.save(user)
    }
    
    // Создание Firebase пользователя
    fun createFirebaseUser(
        firebaseUid: String,
        email: String,
        firstName: String,
        lastName: String,
        phone: String,
        displayName: String? = null,
        photoUrl: String? = null,
        emailVerified: Boolean = false
    ): UserModel {
        
        // Проверяем, не существует ли уже пользователь с таким Firebase UID
        if (userRepository.existsByFirebaseUid(firebaseUid)) {
            throw IllegalArgumentException("Користувач з таким Firebase UID вже існує")
        }
        
        // Проверяем, не существует ли уже пользователь с таким email
        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("Користувач з таким email вже існує")
        }
        
        // Создаем нового Firebase пользователя
        val user = UserModel(
            firstName = firstName.trim(),
            lastName = lastName.trim(),
            email = email.trim().lowercase(),
            phone = phone.trim(),
            password = null, // Firebase пользователи не имеют пароля в нашей базе
            firebaseUid = firebaseUid,
            displayName = displayName,
            photoUrl = photoUrl,
            emailVerified = emailVerified,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        
        return userRepository.save(user)
    }
    
    // Поиск пользователя по Firebase UID
    fun findByFirebaseUid(firebaseUid: String): UserModel? {
        return userRepository.findByFirebaseUid(firebaseUid)
    }
    
    // Валидация данных регистрации
    private fun validateRegistrationData(
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        password: String
    ) {
        if (firstName.isBlank() || lastName.isBlank()) {
            throw IllegalArgumentException("Ім'я та прізвище не можуть бути порожніми")
        }
        
        if (firstName.length < 2 || lastName.length < 2) {
            throw IllegalArgumentException("Ім'я та прізвище повинні містити мінімум 2 символи")
        }
        
        if (!isValidEmail(email)) {
            throw IllegalArgumentException("Невірний формат email")
        }
        
        if (!isValidPhone(phone)) {
            throw IllegalArgumentException("Невірний формат номера телефону. Використовуйте формат +380XXXXXXXXX")
        }
        
        if (password.length < 6) {
            throw IllegalArgumentException("Пароль повинен містити мінімум 6 символів")
        }
    }
    
    // Валидация email
    private fun isValidEmail(email: String): Boolean {
        val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$")
        return emailRegex.matches(email.trim())
    }
    
    // Валидация номера телефона (украинский формат)
    private fun isValidPhone(phone: String): Boolean {
        val phoneRegex = Regex("^\\+380\\d{9}\$")
        return phoneRegex.matches(phone.trim())
    }
    
    // Аутентификация пользователя
    fun authenticateUser(email: String, password: String): UserModel? {
        // Проверяем существование пользователя
        val user = userRepository.findByEmail(email.trim().lowercase())
        if (user == null) {
            return null // Пользователь не найден
        }
        
        // Проверяем пароль
        return if (user.password == password) {
            user
        } else {
            null // Неверный пароль
        }
    }
    
    // Получить пользователя по email
    fun getUserByEmail(email: String): UserModel? {
        return userRepository.findByEmail(email.trim().lowercase())
    }
    
    // Получить пользователя по ID
    fun getUserById(id: Long): UserModel? {
        return userRepository.findById(id).orElse(null)
    }
    
    // Проверить существование пользователя по email
    fun userExists(email: String): Boolean {
        return userRepository.existsByEmail(email.trim().lowercase())
    }
    
    // Обновить пользователя
    fun updateUser(user: UserModel): UserModel {
        val updatedUser = user.copy(updatedAt = LocalDateTime.now())
        return userRepository.save(updatedUser)
    }
    
    // Удалить пользователя
    fun deleteUser(id: Long) {
        userRepository.deleteById(id)
    }
} 
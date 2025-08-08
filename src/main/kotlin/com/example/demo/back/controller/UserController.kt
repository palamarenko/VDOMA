package com.example.demo.back.controller

import com.example.demo.back.dto.LoginRequest
import com.example.demo.back.dto.RegisterRequest
import com.example.demo.back.dto.UserResponse
import com.example.demo.back.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    
    // Регистрация пользователя
    @PostMapping("/register")
    fun registerUser(@RequestBody request: RegisterRequest): ResponseEntity<Any> {
        return try {
            val user = userService.registerUser(
                firstName = request.firstName,
                lastName = request.lastName,
                email = request.email,
                phone = request.phone,
                password = request.password
            )
            
            val response = UserResponse(
                id = user.id!!,
                firstName = user.firstName,
                lastName = user.lastName,
                email = user.email,
                phone = user.phone,
                createdAt = user.createdAt.toString()
            )
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Користувача успішно зареєстровано! Вітаємо в системі!",
                "user" to response
            ))
            
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to e.message
            ))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf(
                "success" to false,
                "message" to "Помилка сервера: ${e.message}"
            ))
        }
    }
    
    // Регистрация Firebase пользователя
    @PostMapping("/firebase-register")
    fun registerFirebaseUser(@RequestBody request: FirebaseRegisterRequest): ResponseEntity<Any> {
        return try {
            val user = userService.createFirebaseUser(
                firebaseUid = request.uid,
                email = request.email,
                firstName = request.firstName,
                lastName = request.lastName,
                phone = request.phone,
                displayName = request.displayName,
                photoUrl = request.photoURL,
                emailVerified = request.emailVerified ?: false
            )
            
            val response = UserResponse(
                id = user.id!!,
                firstName = user.firstName,
                lastName = user.lastName,
                email = user.email,
                phone = user.phone,
                createdAt = user.createdAt.toString()
            )
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Користувача успішно зареєстровано! Вітаємо в системі!",
                "user" to response
            ))
            
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to e.message
            ))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf(
                "success" to false,
                "message" to "Помилка сервера: ${e.message}"
            ))
        }
    }
    
    // Вход пользователя
    @PostMapping("/login")
    fun loginUser(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        return try {
            val user = userService.authenticateUser(request.email, request.password)
            
            if (user != null) {
                val response = UserResponse(
                    id = user.id!!,
                    firstName = user.firstName,
                    lastName = user.lastName,
                    email = user.email,
                    phone = user.phone,
                    createdAt = user.createdAt.toString()
                )
                
                ResponseEntity.ok(mapOf(
                    "success" to true,
                    "message" to "Успішний вхід! Вітаємо, ${user.firstName}!",
                    "user" to response
                ))
            } else {
                // Проверяем, существует ли пользователь с таким email
                val existingUser = userService.getUserByEmail(request.email)
                if (existingUser == null) {
                    ResponseEntity.badRequest().body(mapOf(
                        "success" to false,
                        "message" to "Користувача з таким email не знайдено. Перевірте email або зареєструйтесь."
                    ))
                } else {
                    ResponseEntity.badRequest().body(mapOf(
                        "success" to false,
                        "message" to "Невірний пароль. Перевірте правильність введення."
                    ))
                }
            }
            
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf(
                "success" to false,
                "message" to "Помилка сервера: ${e.message}"
            ))
        }
    }
    
    // Проверка существования пользователя по email
    @GetMapping("/check-email")
    fun checkEmailExists(@RequestParam email: String): ResponseEntity<Any> {
        return try {
            val exists = userService.userExists(email)
            ResponseEntity.ok(mapOf(
                "exists" to exists,
                "message" to if (exists) "Email вже використовується" else "Email доступний"
            ))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf(
                "error" to "Помилка сервера: ${e.message}"
            ))
        }
    }
}

data class FirebaseRegisterRequest(
    val uid: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phone: String,
    val displayName: String? = null,
    val photoURL: String? = null,
    val emailVerified: Boolean? = null
) 
package com.example.demo.back.controller

import com.example.demo.back.service.FirebaseAuthService
import com.example.demo.back.service.UserService
import org.springframework.context.annotation.Profile
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@Profile("firebase")
class FirebaseAuthController(
    private val firebaseAuthService: FirebaseAuthService,
    private val userService: UserService
) {

    /**
     * Верифицирует Firebase токен
     */
    @PostMapping("/verify-token")
    fun verifyToken(@RequestBody request: TokenVerificationRequest): ResponseEntity<Map<String, Any>> {
        val token = request.token
        
        if (token.isBlank()) {
            return ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Токен не надано"
            ))
        }

        val firebaseToken = firebaseAuthService.verifyToken(token)
        
        if (firebaseToken != null) {
            // Проверяем, существует ли пользователь в нашей базе данных
            val user = userService.findByFirebaseUid(firebaseToken.uid)
            
            if (user == null) {
                // Пользователь не найден в базе данных
                return ResponseEntity.ok(mapOf(
                    "success" to false,
                    "message" to "Користувача не знайдено в базі даних",
                    "uid" to firebaseToken.uid
                ))
            }
            
            return ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Токен верифіковано успішно",
                "user" to user
            ))
        } else {
            return ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Недійсний токен"
            ))
        }
    }

    /**
     * Регистрирует пользователя Firebase в нашей базе данных
     */
    @PostMapping("/register-firebase-user")
    fun registerFirebaseUser(@RequestBody request: FirebaseUserRegistrationRequest): ResponseEntity<Map<String, Any>> {
        val token = request.token
        
        if (token.isBlank()) {
            return ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Токен не надано"
            ))
        }

        val firebaseToken = firebaseAuthService.verifyToken(token)
        
        if (firebaseToken == null) {
            return ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Недійсний токен"
            ))
        }

        try {
            // Создаем пользователя в нашей базе данных
            val user = userService.createFirebaseUser(
                firebaseUid = firebaseToken.uid,
                email = request.email,
                firstName = request.firstName,
                lastName = request.lastName,
                phone = request.phone,
                displayName = request.displayName
            )
            
            return ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Користувача зареєстровано успішно",
                "user" to user
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Помилка реєстрації: ${e.message}"
            ))
        }
    }
}

data class TokenVerificationRequest(
    val token: String
)

data class FirebaseUserRegistrationRequest(
    val token: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phone: String,
    val displayName: String
)

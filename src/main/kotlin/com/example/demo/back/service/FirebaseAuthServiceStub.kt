package com.example.demo.back.service

import com.google.firebase.auth.FirebaseToken
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service

@Service
@Profile("!firebase")
class FirebaseAuthServiceStub {

    /**
     * Верифицирует Firebase ID токен (заглушка)
     */
    fun verifyToken(idToken: String): FirebaseToken? {
        println("Firebase token verification is disabled")
        return null
    }

    /**
     * Получает пользователя по UID (заглушка)
     */
    fun getUserByUid(uid: String): com.google.firebase.auth.UserRecord? {
        println("Firebase getUserByUid is disabled")
        return null
    }

    /**
     * Создает пользователя в Firebase (заглушка)
     */
    fun createUser(email: String, password: String, displayName: String? = null): com.google.firebase.auth.UserRecord? {
        println("Firebase createUser is disabled")
        return null
    }

    /**
     * Обновляет профиль пользователя (заглушка)
     */
    fun updateUserProfile(uid: String, displayName: String? = null, photoUrl: String? = null): com.google.firebase.auth.UserRecord? {
        println("Firebase updateUserProfile is disabled")
        return null
    }

    /**
     * Удаляет пользователя (заглушка)
     */
    fun deleteUser(uid: String): Boolean {
        println("Firebase deleteUser is disabled")
        return false
    }
}

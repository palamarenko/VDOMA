package com.example.demo.back.service

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service

@Service
@Profile("firebase")
class FirebaseAuthService(private val firebaseAuth: FirebaseAuth?) {

    /**
     * Верифицирует Firebase ID токен
     */
    fun verifyToken(idToken: String): FirebaseToken? {
        return try {
            firebaseAuth?.verifyIdToken(idToken)
        } catch (e: Exception) {
            println("Token verification failed: ${e.message}")
            null
        }
    }

    /**
     * Получает пользователя по UID
     */
    fun getUserByUid(uid: String): com.google.firebase.auth.UserRecord? {
        return try {
            firebaseAuth?.getUser(uid)
        } catch (e: Exception) {
            println("Get user by UID failed: ${e.message}")
            null
        }
    }

    /**
     * Создает пользователя в Firebase
     */
    fun createUser(email: String, password: String, displayName: String? = null): com.google.firebase.auth.UserRecord? {
        return try {
            val request = com.google.firebase.auth.UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setDisplayName(displayName)
                .setEmailVerified(false)
            
            firebaseAuth?.createUser(request)
        } catch (e: Exception) {
            println("Create user failed: ${e.message}")
            null
        }
    }

    /**
     * Обновляет профиль пользователя
     */
    fun updateUserProfile(uid: String, displayName: String? = null, photoUrl: String? = null): com.google.firebase.auth.UserRecord? {
        return try {
            val request = com.google.firebase.auth.UserRecord.UpdateRequest(uid)
                .setDisplayName(displayName)
                .setPhotoUrl(photoUrl)
            
            firebaseAuth?.updateUser(request)
        } catch (e: Exception) {
            println("Update user profile failed: ${e.message}")
            null
        }
    }

    /**
     * Удаляет пользователя
     */
    fun deleteUser(uid: String): Boolean {
        return try {
            firebaseAuth?.deleteUser(uid)
            true
        } catch (e: Exception) {
            println("Delete user failed: ${e.message}")
            false
        }
    }
}

package com.example.demo.back.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.io.ClassPathResource
import java.io.IOException

@Configuration
class FirebaseConfig {

    @Bean
    @Profile("firebase")
    @Throws(IOException::class)
    fun firebaseApp(): FirebaseApp? {
        return try {
            if (FirebaseApp.getApps().isEmpty()) {
                // Для разработки используем Application Default Credentials
                // В продакшене замените на файл сервисного аккаунта
                val options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .build()
                
                FirebaseApp.initializeApp(options)
            } else {
                FirebaseApp.getInstance()
            }
        } catch (e: Exception) {
            println("Firebase initialization failed: ${e.message}")
            println("Firebase Admin SDK will be disabled for this session")
            null
        }
    }

    @Bean
    @Profile("firebase")
    fun firebaseAuth(): FirebaseAuth? {
        return try {
            FirebaseAuth.getInstance()
        } catch (e: Exception) {
            println("FirebaseAuth initialization failed: ${e.message}")
            null
        }
    }

    @Bean
    @Profile("!firebase")
    fun firebaseAppDisabled(): Any? {
        println("Firebase Admin SDK is disabled for this profile")
        return null
    }

    @Bean
    @Profile("!firebase")
    fun firebaseAuthDisabled(): Any? {
        println("FirebaseAuth is disabled for this profile")
        return null
    }
}

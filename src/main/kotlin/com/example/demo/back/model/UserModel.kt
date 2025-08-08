package com.example.demo.back.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class UserModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(name = "first_name", nullable = false)
    val firstName: String = "",
    
    @Column(name = "last_name", nullable = false)
    val lastName: String = "",
    
    @Column(name = "email", nullable = false, unique = true)
    val email: String = "",
    
    @Column(name = "phone", nullable = false)
    val phone: String = "",
    
    @Column(name = "password", nullable = true) // Теперь может быть null для Firebase пользователей
    val password: String? = null,
    
    @Column(name = "firebase_uid", unique = true)
    val firebaseUid: String? = null,
    
    @Column(name = "display_name")
    val displayName: String? = null,
    
    @Column(name = "photo_url")
    val photoUrl: String? = null,
    
    @Column(name = "email_verified", nullable = false)
    val emailVerified: Boolean = false,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    // Конструктор по умолчанию для JPA
    constructor() : this(
        id = null,
        firstName = "",
        lastName = "",
        email = "",
        phone = "",
        password = null,
        firebaseUid = null,
        displayName = null,
        photoUrl = null,
        emailVerified = false,
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )
} 
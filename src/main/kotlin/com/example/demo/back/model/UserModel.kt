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
    
    @Column(name = "password", nullable = false)
    val password: String = "",
    
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
        password = "",
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )
} 
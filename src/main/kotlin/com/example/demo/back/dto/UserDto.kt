package com.example.demo.back.dto

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val password: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class UserResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val createdAt: String
) 
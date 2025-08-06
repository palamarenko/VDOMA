package com.example.demo.back.repository

import com.example.demo.back.model.UserModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<UserModel, Long> {
    
    fun findByEmail(email: String): UserModel?
    
    fun existsByEmail(email: String): Boolean
} 
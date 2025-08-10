package com.example.demo.back.dto

data class ApartmentDto(
    val id: Long?,
    val title: String,
    val description: String?,
    val address: String,
    val city: String,
    val latitude: Double?,
    val longitude: Double?,
    val pricePerNight: Double,
    val rating: Double,
    val reviewCount: Int,
    val bedrooms: Int,
    val bathrooms: Int,
    val maxGuests: Int,
    val amenities: List<String>?,
    val imageUrls: List<String>?,
    val isAvailable: Boolean
)

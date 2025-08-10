package com.example.demo.back.model

import jakarta.persistence.*

@Entity
@Table(name = "apartments")
data class ApartmentModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(name = "title", nullable = false)
    val title: String = "",
    
    @Column(name = "description", columnDefinition = "TEXT")
    val description: String? = null,
    
    @Column(name = "address", nullable = false)
    val address: String = "",
    
    @Column(name = "city", nullable = false)
    val city: String = "",
    
    @Column(name = "latitude")
    val latitude: Double? = null,
    
    @Column(name = "longitude")
    val longitude: Double? = null,
    
    @Column(name = "price_per_night")
    val pricePerNight: Double = 0.0,
    
    @Column(name = "rating")
    val rating: Double = 0.0,
    
    @Column(name = "review_count")
    val reviewCount: Int = 0,
    
    @Column(name = "bedrooms")
    val bedrooms: Int = 1,
    
    @Column(name = "bathrooms")
    val bathrooms: Int = 1,
    
    @Column(name = "max_guests")
    val maxGuests: Int = 2,
    
    @Column(name = "amenities", columnDefinition = "TEXT")
    val amenities: String? = null,
    
    @Column(name = "image_urls", columnDefinition = "TEXT")
    val imageUrls: String? = null,
    
    @Column(name = "is_available")
    val isAvailable: Boolean = true
) {
    // Конструктор по умолчанию для JPA
    constructor() : this(
        id = null,
        title = "",
        description = null,
        address = "",
        city = "",
        latitude = null,
        longitude = null,
        pricePerNight = 0.0,
        rating = 0.0,
        reviewCount = 0,
        bedrooms = 1,
        bathrooms = 1,
        maxGuests = 2,
        amenities = null,
        imageUrls = null,
        isAvailable = true
    )
}

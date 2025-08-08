package com.example.demo.back.model

import jakarta.persistence.*

@Entity
@Table(name = "settlements")
data class SettlementModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(name = "name", nullable = false)
    val name: String = "",
    
    @Column(name = "type")
    val type: String? = null,
    
    @Column(name = "region")
    val region: String? = null,
    
    @Column(name = "district")
    val district: String? = null,
    
    @Column(name = "latitude")
    val latitude: Double? = null,
    
    @Column(name = "longitude")
    val longitude: Double? = null,
    
    @Column(name = "population")
    val population: Int? = null,
    
    @Column(name = "search_name", nullable = false)
    val searchName: String = ""
) {
    // Конструктор по умолчанию для JPA
    constructor() : this(
        id = null,
        name = "",
        type = null,
        region = null,
        district = null,
        latitude = null,
        longitude = null,
        population = null,
        searchName = ""
    )
}

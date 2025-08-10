package com.example.demo.back.repository

import com.example.demo.back.model.ApartmentModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ApartmentRepository : JpaRepository<ApartmentModel, Long> {
    
    /**
     * Поиск апартаментов по городу
     */
    fun findByCityIgnoreCase(city: String): List<ApartmentModel>
    
    /**
     * Поиск апартаментов по координатам в радиусе
     */
    @Query("""
        SELECT a FROM ApartmentModel a 
        WHERE a.latitude IS NOT NULL 
        AND a.longitude IS NOT NULL
        AND (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(a.latitude)) * 
                cos(radians(a.longitude) - radians(:lng)) + 
                sin(radians(:lat)) * sin(radians(a.latitude))
            )
        ) <= :radius
    """)
    fun findApartmentsNearLocation(
        @Param("lat") latitude: Double,
        @Param("lng") longitude: Double,
        @Param("radius") radiusKm: Double
    ): List<ApartmentModel>
    
    /**
     * Поиск доступных апартаментов
     */
    fun findByIsAvailableTrue(): List<ApartmentModel>
    
    /**
     * Поиск апартаментов по цене
     */
    fun findByPricePerNightBetween(minPrice: Double, maxPrice: Double): List<ApartmentModel>
    
    /**
     * Поиск апартаментов по количеству гостей
     */
    fun findByMaxGuestsGreaterThanEqual(guests: Int): List<ApartmentModel>
}

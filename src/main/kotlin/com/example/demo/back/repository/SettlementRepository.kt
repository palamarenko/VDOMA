package com.example.demo.back.repository

import com.example.demo.back.model.SettlementModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface SettlementRepository : JpaRepository<SettlementModel, Long> {
    
    // Поиск по названию (точное совпадение)
    fun findByName(name: String): SettlementModel?
    
    // Поиск по названию (без учета регистра)
    fun findByNameIgnoreCase(name: String): SettlementModel?
    
    // Поиск по части названия (без учета регистра)
    fun findByNameContainingIgnoreCase(name: String): List<SettlementModel>
    
    // Поиск по search_name (для оптимизированного поиска)
    fun findBySearchNameContainingIgnoreCase(searchName: String): List<SettlementModel>
    
    // Поиск по региону
    fun findByRegionIgnoreCase(region: String): List<SettlementModel>
    
    // Поиск по типу населенного пункта
    fun findByTypeIgnoreCase(type: String): List<SettlementModel>
    
    // Полный текстовый поиск
    @Query("SELECT s FROM SettlementModel s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))" +
           "ORDER BY s.population DESC NULLS LAST, s.name ASC")
    fun searchSettlements(@Param("query") query: String): List<SettlementModel>
    
    // Поиск с лимитом результатов
    @Query("SELECT s FROM SettlementModel s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.searchName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.region) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.district) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY s.population DESC NULLS LAST, s.name ASC")
    fun searchSettlementsWithLimit(@Param("query") query: String, limit: Int): List<SettlementModel>
}

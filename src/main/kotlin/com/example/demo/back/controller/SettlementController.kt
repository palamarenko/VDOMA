package com.example.demo.back.controller

import com.example.demo.back.service.SettlementService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/settlements")
class SettlementController(
    private val settlementService: SettlementService
) {
    
    /**
     * Поиск населенных пунктов
     */
    @GetMapping("/search")
    fun searchSettlements(
        @RequestParam query: String,
        @RequestParam(defaultValue = "10") limit: Int
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val settlements = settlementService.searchSettlements(query, limit)
            
            val results = settlements.map { settlement ->
                val result = mapOf(
                    "id" to settlement.id,
                    "name" to settlement.name,
                    "type" to settlement.type,
                    "region" to settlement.region,
                    "district" to settlement.district,
                    "latitude" to settlement.latitude,
                    "longitude" to settlement.longitude,
                    "population" to settlement.population
                )
                println("Отправка результата: ${settlement.name} -> region: ${settlement.region}")
                result
            }
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "query" to query,
                "count" to results.size,
                "results" to results
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка поиска: ${e.message}"
            ))
        }
    }
    
    /**
     * Получение населенного пункта по названию
     */
    @GetMapping("/by-name")
    fun getSettlementByName(@RequestParam name: String): ResponseEntity<Map<String, Any>> {
        return try {
            val settlement = settlementService.getSettlementByName(name)
            
            if (settlement != null) {
                val result = mapOf(
                    "id" to settlement.id,
                    "name" to settlement.name,
                    "type" to settlement.type,
                    "region" to settlement.region,
                    "district" to settlement.district,
                    "latitude" to settlement.latitude,
                    "longitude" to settlement.longitude,
                    "population" to settlement.population
                )
                
                ResponseEntity.ok(mapOf(
                    "success" to true,
                    "settlement" to result
                ))
            } else {
                ResponseEntity.ok(mapOf(
                    "success" to false,
                    "message" to "Населенный пункт не найден"
                ))
            }
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка поиска: ${e.message}"
            ))
        }
    }
    
    /**
     * Получение населенных пунктов по региону
     */
    @GetMapping("/by-region")
    fun getSettlementsByRegion(
        @RequestParam region: String,
        @RequestParam(defaultValue = "50") limit: Int
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val settlements = settlementService.getSettlementsByRegion(region).take(limit)
            
            val results = settlements.map { settlement ->
                mapOf(
                    "id" to settlement.id,
                    "name" to settlement.name,
                    "type" to settlement.type,
                    "region" to settlement.region,
                    "district" to settlement.district,
                    "latitude" to settlement.latitude,
                    "longitude" to settlement.longitude,
                    "population" to settlement.population
                )
            }
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "region" to region,
                "count" to results.size,
                "results" to results
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка поиска: ${e.message}"
            ))
        }
    }
    
    /**
     * Загрузка данных из файла city.json
     */
    @PostMapping("/load-data")
    fun loadSettlementsData(): ResponseEntity<Map<String, Any>> {
        return try {
            settlementService.loadSettlementsFromCityJson()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Данные загружены успешно из city.json"
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка загрузки: ${e.message}"
            ))
        }
    }
    
    /**
     * Очистка базы данных
     */
    @DeleteMapping("/clear")
    fun clearSettlementsData(): ResponseEntity<Map<String, Any>> {
        return try {
            settlementService.clearSettlements()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "База данных очищена"
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка очистки: ${e.message}"
            ))
        }
    }
    
    /**
     * Получение статистики
     */
    @GetMapping("/statistics")
    fun getStatistics(): ResponseEntity<Map<String, Any>> {
        return try {
            val stats = settlementService.getStatistics()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "statistics" to stats
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка получения статистики: ${e.message}"
            ))
        }
    }
}

package com.example.demo.back.controller

import com.example.demo.back.service.ApartmentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/apartments")
class ApartmentController(
    private val apartmentService: ApartmentService
) {
    
    /**
     * Получение всех апартаментов
     */
    @GetMapping
    fun getAllApartments(): ResponseEntity<Map<String, Any>> {
        return try {
            val apartments = apartmentService.getAllApartments()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "count" to apartments.size,
                "apartments" to apartments
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка получения апартаментов: ${e.message}"
            ))
        }
    }
    
    /**
     * Поиск апартаментов по городу
     */
    @GetMapping("/by-city")
    fun getApartmentsByCity(@RequestParam city: String): ResponseEntity<Map<String, Any>> {
        return try {
            val apartments = apartmentService.getApartmentsByCity(city)
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "city" to city,
                "count" to apartments.size,
                "apartments" to apartments
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка поиска: ${e.message}"
            ))
        }
    }
    
    /**
     * Поиск апартаментов по координатам
     */
    @GetMapping("/near-location")
    fun getApartmentsNearLocation(
        @RequestParam latitude: Double,
        @RequestParam longitude: Double,
        @RequestParam(defaultValue = "10.0") radius: Double
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val apartments = apartmentService.getApartmentsNearLocation(latitude, longitude, radius)
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "latitude" to latitude,
                "longitude" to longitude,
                "radius" to radius,
                "count" to apartments.size,
                "apartments" to apartments
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка поиска: ${e.message}"
            ))
        }
    }
    
    /**
     * Получение доступных апартаментов
     */
    @GetMapping("/available")
    fun getAvailableApartments(): ResponseEntity<Map<String, Any>> {
        return try {
            val apartments = apartmentService.getAvailableApartments()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "count" to apartments.size,
                "apartments" to apartments
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка получения: ${e.message}"
            ))
        }
    }
    
    /**
     * Генерация моковых данных
     */
    @PostMapping("/generate-mock")
    fun generateMockApartments(): ResponseEntity<Map<String, Any>> {
        return try {
            apartmentService.generateMockApartments()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Моковые данные апартаментов успешно сгенерированы"
            ))
            
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "success" to false,
                "message" to "Ошибка генерации: ${e.message}"
            ))
        }
    }
    
    /**
     * Очистка всех апартаментов
     */
    @DeleteMapping("/clear")
    fun clearAllApartments(): ResponseEntity<Map<String, Any>> {
        return try {
            apartmentService.clearAllApartments()
            
            ResponseEntity.ok(mapOf(
                "success" to true,
                "message" to "Все апартаменты удалены"
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
            val stats = apartmentService.getStatistics()
            
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

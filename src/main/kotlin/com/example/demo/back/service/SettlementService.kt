package com.example.demo.back.service

import com.example.demo.back.model.SettlementModel
import com.example.demo.back.repository.SettlementRepository
import com.example.demo.back.dto.CityDto
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.stereotype.Service
import java.io.File

@Service
class SettlementService(
    private val settlementRepository: SettlementRepository
) {

    private val objectMapper = ObjectMapper()

    /**
     * Поиск населенных пунктов по запросу
     */
    fun searchSettlements(query: String, limit: Int = 10): List<SettlementModel> {
        if (query.isBlank()) {
            return emptyList()
        }
        
        // Приводим запрос к нижнему регистру для поиска
        val searchQuery = query.trim().lowercase()
        return settlementRepository.searchSettlements(searchQuery).take(limit)
    }

    /**
     * Получение населенного пункта по точному названию
     */
    fun getSettlementByName(name: String): SettlementModel? {
        return settlementRepository.findByNameIgnoreCase(name.trim())
    }

    /**
     * Получение всех населенных пунктов в регионе
     */
    fun getSettlementsByRegion(region: String): List<SettlementModel> {
        return settlementRepository.findByRegionIgnoreCase(region.trim())
    }

    /**
     * Получение населенных пунктов по типу
     */
    fun getSettlementsByType(type: String): List<SettlementModel> {
        return settlementRepository.findByTypeIgnoreCase(type.trim())
    }

    /**
     * Загрузка данных из файла city.json
     */
    fun loadSettlementsFromCityJson() {
        try {
            val file = File("city.json")
            if (!file.exists()) {
                println("Файл city.json не найден в корне проекта")
                return
            }

            println("Начинаем загрузку данных из файла city.json...")

            // Читаем JSON массив городов
            val cities: List<CityDto> = objectMapper.readValue(file)

            var count = 0
            val settlements = mutableListOf<SettlementModel>()

            for (city in cities) {
                try {
                    println("Обработка города: name=${city.name}, parent=${city.parent}, lat=${city.lat}, lng=${city.lng}")

                    val settlement = convertCityToSettlement(city)
                    if (settlement != null) {
                        settlements.add(settlement)
                        count++

                        // Сохраняем пакетами по 1000 записей
                        if (settlements.size >= 1000) {
                            settlementRepository.saveAll(settlements)
                            println("Сохранено $count записей...")
                            settlements.clear()
                        }
                    }
                } catch (e: Exception) {
                    println("Ошибка при обработке города: ${city.name} - ${e.message}")
                }
            }

            // Сохраняем оставшиеся записи
            if (settlements.isNotEmpty()) {
                settlementRepository.saveAll(settlements)
            }

            println("Загрузка завершена. Всего загружено $count записей.")

        } catch (e: Exception) {
            println("Ошибка при загрузке файла: ${e.message}")
            e.printStackTrace()
        }
    }

    /**
     * Конвертация CityDto в SettlementModel
     */
    private fun convertCityToSettlement(city: CityDto): SettlementModel? {
        if (city.name.isNullOrBlank()) {
            return null
        }

        return try {
            val settlement = SettlementModel(
                name = removeTypeFromName(city.name.trim()),
                type = extractTypeFromName(city.name),
                region = city.parent?.trim(),
                district = null, // В city.json нет информации о районах
                latitude = city.lat,
                longitude = city.lng,
                population = null, // В city.json нет информации о населении
                searchName = removeTypeFromName(city.name.trim())
            )

            println("Конвертация: ${city.name} -> region: ${settlement.region}, type: ${settlement.type}")

            settlement
        } catch (e: Exception) {
            null
        }
    }


    private fun removeTypeFromName(name: String): String {
        return name
            .replace("місто", "")
            .replace("село", "")
            .replace("селище міського типу", "")
    }

    /**
     * Извлекает тип населенного пункта из названия
     */
    private fun extractTypeFromName(name: String): String? {
        return when {
            name.contains("місто") -> "місто"
            name.contains("село") -> "село"
            name.contains("селище") -> "селище"
            name.contains("поселок") -> "поселок"
            name.contains("область") -> "область"
            name.contains("район") -> "район"
            name.contains("селище міського типу") -> "смт"
            else -> null
        }
    }

    /**
     * Очистка базы данных settlements
     */
    fun clearSettlements() {
        settlementRepository.deleteAll()
        println("База данных settlements очищена")
    }

    /**
     * Получение статистики
     */
    fun getStatistics(): Map<String, Any> {
        val totalCount = settlementRepository.count()
        val regions = settlementRepository.findAll().mapNotNull { it.region }.distinct().size
        val types = settlementRepository.findAll().mapNotNull { it.type }.distinct().size

        return mapOf(
            "totalSettlements" to totalCount,
            "regions" to regions,
            "types" to types
        )
    }
}

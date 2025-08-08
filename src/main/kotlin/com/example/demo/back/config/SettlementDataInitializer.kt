package com.example.demo.back.config

import com.example.demo.back.service.SettlementService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class SettlementDataInitializer : CommandLineRunner {

    @Autowired
    private lateinit var settlementService: SettlementService

    override fun run(vararg args: String) {
        println("Проверка базы данных settlements...")
        
        val stats = settlementService.getStatistics()
        val totalCount = stats["totalSettlements"] as Long
        
        if (totalCount == 0L) {
            println("База данных settlements пуста. Начинаем загрузку данных из city.json...")
            settlementService.loadSettlementsFromCityJson()
        } else {
            println("База данных settlements уже содержит $totalCount записей.")
        }
    }
}

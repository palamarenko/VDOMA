package com.example.demo.back

import com.example.demo.back.model.CityModel
import com.example.demo.back.model.cities
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class ApiController {

    @GetMapping("/getCityByName")
    fun getCitiesByName(@RequestParam name: String): List<CityModel> {
        return cities.filter { it.name.startsWith(name, ignoreCase = true) }
    }
}
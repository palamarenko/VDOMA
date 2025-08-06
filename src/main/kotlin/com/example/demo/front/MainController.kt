package com.example.demo.front

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping


@Controller
class MainController {

    @GetMapping("/")
    fun main() = "page"

    @GetMapping("/login")
    fun login(): String {
        return "login"
    }
    
    @GetMapping("/register")
    fun register(): String {
        return "register"
    }

}
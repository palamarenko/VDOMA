package com.example.demo.back.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class CityDto(
    @JsonProperty("id")
    val id: Long? = null,
    
    @JsonProperty("name")
    val name: String? = null,
    
    @JsonProperty("parentName")
    val parent: String? = null,
    
    @JsonProperty("parentID")
    val parentID: Long? = null,
    
    @JsonProperty("lat")
    val lat: Double? = null,
    
    @JsonProperty("lng")
    val lng: Double? = null,
    
)

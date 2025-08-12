package com.example.demo.back.service

import com.example.demo.back.dto.ApartmentDto
import com.example.demo.back.model.ApartmentModel
import com.example.demo.back.repository.ApartmentRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApartmentService(
    private val apartmentRepository: ApartmentRepository
) {
    
    /**
     * Получение всех апартаментов
     */
    fun getAllApartments(): List<ApartmentDto> {
        return apartmentRepository.findAll().map { it.toDto() }
    }
    
    /**
     * Поиск апартаментов по городу
     */
    fun getApartmentsByCity(city: String): List<ApartmentDto> {
        return apartmentRepository.findByCityIgnoreCase(city).map { it.toDto() }
    }
    
    /**
     * Поиск апартаментов по координатам
     */
    fun getApartmentsNearLocation(latitude: Double, longitude: Double, radiusKm: Double = 10.0): List<ApartmentDto> {
        return apartmentRepository.findApartmentsNearLocation(latitude, longitude, radiusKm).map { it.toDto() }
    }
    
    /**
     * Получение доступных апартаментов
     */
    fun getAvailableApartments(): List<ApartmentDto> {
        return apartmentRepository.findByIsAvailableTrue().map { it.toDto() }
    }
    
    /**
     * Генерация моковых данных апартаментов
     */
    fun generateMockApartments() {
        if (apartmentRepository.count() > 0) {
            return // Данные уже существуют
        }
        
        val mockApartments = listOf(
            ApartmentModel(
                title = "Современная квартира в центре Киева",
                description = "Уютная квартира с видом на город, полностью оборудованная для комфортного проживания",
                address = "ул. Крещатик, 15",
                city = "Киев",
                latitude = 50.4501,
                longitude = 30.5234,
                pricePerNight = 2500.0,
                rating = 4.8,
                reviewCount = 127,
                bedrooms = 2,
                bathrooms = 1,
                maxGuests = 4,
                amenities = "Wi-Fi,Кондиционер,Кухня,Стиральная машина,Бесплатная парковка",
                imageUrls = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Стильный лофт на Подоле",
                description = "Просторный лофт в историческом районе с высокими потолками и современным дизайном",
                address = "ул. Андреевская, 23",
                city = "Киев",
                latitude = 50.4580,
                longitude = 30.5170,
                pricePerNight = 3200.0,
                rating = 4.9,
                reviewCount = 89,
                bedrooms = 1,
                bathrooms = 1,
                maxGuests = 3,
                amenities = "Wi-Fi,Кондиционер,Кухня,Балкон,Вид на город",
                imageUrls = "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500,https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Уютная студия возле метро",
                description = "Компактная студия в тихом районе, идеально подходит для одного или двух гостей",
                address = "ул. Большая Васильковская, 45",
                city = "Киев",
                latitude = 50.4200,
                longitude = 30.5200,
                pricePerNight = 1800.0,
                rating = 4.6,
                reviewCount = 156,
                bedrooms = 1,
                bathrooms = 1,
                maxGuests = 2,
                amenities = "Wi-Fi,Кондиционер,Кухня,Метро рядом,Магазины",
                imageUrls = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500,https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Просторная квартира на Печерске",
                description = "Роскошная квартира в престижном районе с панорамными окнами и террасой",
                address = "ул. Печерский спуск, 12",
                city = "Киев",
                latitude = 50.4300,
                longitude = 30.5400,
                pricePerNight = 4500.0,
                rating = 4.9,
                reviewCount = 203,
                bedrooms = 3,
                bathrooms = 2,
                maxGuests = 6,
                amenities = "Wi-Fi,Кондиционер,Кухня,Терраса,Спортзал,Бассейн",
                imageUrls = "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Дом в пригороде Киева",
                description = "Уютный дом с садом в тихом пригороде, идеально для семейного отдыха",
                address = "с. Козин, ул. Центральная, 8",
                city = "Киев",
                latitude = 50.3800,
                longitude = 30.4800,
                pricePerNight = 2800.0,
                rating = 4.7,
                reviewCount = 67,
                bedrooms = 2,
                bathrooms = 1,
                maxGuests = 5,
                amenities = "Wi-Fi,Кухня,Сад,Бесплатная парковка,Тишина",
                imageUrls = "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500,https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Апартаменты с видом на Днепр",
                description = "Современные апартаменты с панорамным видом на реку Днепр",
                address = "Набережное шоссе, 34",
                city = "Киев",
                latitude = 50.4400,
                longitude = 30.5300,
                pricePerNight = 3800.0,
                rating = 4.8,
                reviewCount = 134,
                bedrooms = 2,
                bathrooms = 2,
                maxGuests = 4,
                amenities = "Wi-Fi,Кондиционер,Кухня,Вид на реку,Балкон",
                imageUrls = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500,https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Квартира в историческом центре",
                description = "Квартира в старинном доме с сохраненным историческим интерьером",
                address = "ул. Владимирская, 56",
                city = "Киев",
                latitude = 50.4500,
                longitude = 30.5100,
                pricePerNight = 2200.0,
                rating = 4.5,
                reviewCount = 98,
                bedrooms = 1,
                bathrooms = 1,
                maxGuests = 3,
                amenities = "Wi-Fi,Кухня,Исторический интерьер,Центр города",
                imageUrls = "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
                isAvailable = true
            ),
            ApartmentModel(
                title = "Современная студия в бизнес-центре",
                description = "Стильная студия в современном бизнес-центре с полным набором удобств",
                address = "ул. Шелковичная, 78",
                city = "Киев",
                latitude = 50.4600,
                longitude = 30.5200,
                pricePerNight = 2600.0,
                rating = 4.7,
                reviewCount = 112,
                bedrooms = 1,
                bathrooms = 1,
                maxGuests = 2,
                amenities = "Wi-Fi,Кондиционер,Кухня,Бизнес-центр,Консьерж",
                imageUrls = "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500,https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500",
                isAvailable = true
            )
        )
        
        apartmentRepository.saveAll(mockApartments)
    }
    
    /**
     * Очистка всех апартаментов
     */
    fun clearAllApartments() {
        apartmentRepository.deleteAll()
    }
    
    /**
     * Получение статистики по апартаментам
     */
    fun getStatistics(): Map<String, Any> {
        val total = apartmentRepository.count()
        val available = apartmentRepository.findByIsAvailableTrue().size
        val avgPrice = apartmentRepository.findAll().map { it.pricePerNight }.average()
        val avgRating = apartmentRepository.findAll().map { it.rating }.average()
        
        return mapOf(
            "total" to total,
            "available" to available,
            "averagePrice" to (avgPrice ?: 0.0),
            "averageRating" to (avgRating ?: 0.0)
        )
    }
    
    /**
     * Преобразование модели в DTO
     */
    private fun ApartmentModel.toDto(): ApartmentDto {
        return ApartmentDto(
            id = this.id,
            title = this.title,
            description = this.description,
            address = this.address,
            city = this.city,
            latitude = this.latitude,
            longitude = this.longitude,
            pricePerNight = this.pricePerNight,
            rating = this.rating,
            reviewCount = this.reviewCount,
            bedrooms = this.bedrooms,
            bathrooms = this.bathrooms,
            maxGuests = this.maxGuests,
            amenities = this.amenities?.split(","),
            imageUrls = this.imageUrls?.split(","),
            isAvailable = this.isAvailable
        )
    }
}

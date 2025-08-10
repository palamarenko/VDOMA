// Глобальные переменные для апартаментов
let apartments = [];
let apartmentMarkers = [];
let selectedApartment = null;
let currentInfoWindow = null;

// Инициализация функциональности апартаментов
function initializeApartments() {
    // Загружаем апартаменты
    loadApartments();
    
    // Добавляем обработчики событий для фильтров (с проверкой существования элементов)
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const guestsFilter = document.getElementById('guests-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const closeDetailsBtn = document.getElementById('close-details-btn');
    
    if (priceFilter) {
        priceFilter.addEventListener('input', filterApartments);
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', filterApartments);
    }
    
    if (guestsFilter) {
        guestsFilter.addEventListener('change', filterApartments);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeApartmentDetails);
    }
}

// Загрузка апартаментов
async function loadApartments() {
    try {
        console.log('Начинаем загрузку апартаментов...');
        
        // Сначала генерируем моковые данные
        await generateMockApartments();
        
        // Затем загружаем все апартаменты
        await loadAllApartments();
        
        // Отображаем апартаменты на карте
        displayApartmentsOnMap();
        
        // Отображаем список апартаментов
        displayApartmentsList();
        
        console.log('Загрузка апартаментов завершена успешно');
        
    } catch (error) {
        console.error('Критическая ошибка загрузки апартаментов:', error);
        // Устанавливаем пустой массив в случае ошибки
        apartments = [];
        // Пытаемся отобразить пустой список
        try {
            displayApartmentsList();
        } catch (displayError) {
            console.error('Ошибка отображения пустого списка:', displayError);
        }
    }
}

// Генерация моковых данных
async function generateMockApartments() {
    try {
        const response = await fetch('/api/apartments/generate-mock', {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Ошибка генерации моковых данных');
        }
        
        console.log('Моковые данные успешно сгенерированы');
    } catch (error) {
        console.error('Ошибка генерации моковых данных:', error);
    }
}

// Загрузка всех апартаментов
async function loadAllApartments() {
    try {
        const response = await fetch('/api/apartments');
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки апартаментов');
        }
        
        const data = await response.json();
        
        // Проверяем структуру ответа
        if (Array.isArray(data)) {
            apartments = data;
        } else if (data.apartments && Array.isArray(data.apartments)) {
            apartments = data.apartments;
        } else if (data.success && data.apartments && Array.isArray(data.apartments)) {
            apartments = data.apartments;
        } else {
            console.warn('Неожиданная структура ответа API:', data);
            apartments = [];
        }
        
        console.log('Загружено апартаментов:', apartments.length);
    } catch (error) {
        console.error('Ошибка загрузки апартаментов:', error);
        apartments = [];
    }
}

// Поиск апартаментов по городу
async function searchApartmentsByCity(city) {
    try {
        const response = await fetch(`/api/apartments/by-city?city=${encodeURIComponent(city)}`);
        const result = await response.json();
        
        if (result.success) {
            apartments = result.apartments;
            displayApartmentsOnMap();
            displayApartmentsList();
            console.log(`Найдено ${apartments.length} апартаментов в городе ${city || 'неизвестный город'}`);
        } else {
            console.error('Ошибка поиска апартаментов:', result.message);
        }
        
    } catch (error) {
        console.error('Ошибка при поиске апартаментов:', error);
    }
}

// Поиск апартаментов по координатам
async function searchApartmentsNearLocation(latitude, longitude, radius = 10.0) {
    try {
        const response = await fetch(`/api/apartments/near-location?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
        const result = await response.json();
        
        if (result.success) {
            apartments = result.apartments;
            displayApartmentsOnMap();
            displayApartmentsList();
            console.log(`Найдено ${apartments.length} апартаментов в радиусе ${radius || 10.0} км`);
        } else {
            console.error('Ошибка поиска апартаментов:', result.message);
        }
        
    } catch (error) {
        console.error('Ошибка при поиске апартаментов:', error);
    }
}

// Отображение апартаментов на карте
function displayApartmentsOnMap() {
    // Проверяем, что карта существует
    if (typeof map === 'undefined' || !map) {
        console.warn('Карта не инициализирована, пропускаем отображение апартаментов');
        return;
    }
    
    // Проверяем, что Google Maps API загружен
    if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps API не загружен, пропускаем отображение апартаментов');
        return;
    }
    
    clearApartmentMarkers(); // Очищаем предыдущие маркеры
    apartmentMarkers = []; // Очищаем массив маркеров

    if (!Array.isArray(apartments) || apartments.length === 0) {
        console.log('Нет апартаментов для отображения на карте');
        return;
    }

    apartments.forEach(apartment => {
        try {
            const position = { lat: apartment.latitude, lng: apartment.longitude };
            
            // Создаем SVG иконку с ценой
            const svgIcon = {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="70" height="30" rx="15" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
                        <polygon points="70,10 80,20 70,30" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
                        <text x="35" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="white">${apartment.pricePerNight || 0}</text>
                        <text x="35" y="32" font-family="Arial, sans-serif" font-size="8" text-anchor="middle" fill="white">грн</text>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(80, 40),
                anchor: new google.maps.Point(40, 20)
            };
            
                    const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: apartment.title || 'Апартамент',
            icon: svgIcon
        });
            
            // Создаем информационное окно
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="info-window">
                        <h3>${apartment.title || 'Без названия'}</h3>
                        <p><strong>Цена:</strong> ${apartment.pricePerNight || 0} грн/ночь</p>
                        <p><strong>Рейтинг:</strong> ⭐ ${apartment.rating || 0}/5</p>
                        <p><strong>Гости:</strong> 👥 ${apartment.maxGuests || 1}</p>
                        <button onclick="openApartmentDetails(${JSON.stringify(apartment).replace(/"/g, '&quot;')})" class="info-window-btn">
                            Подробнее
                        </button>
                    </div>
                `
            });
            
            // Обработчик клика по маркеру
            marker.addListener('click', () => {
                // Закрываем все открытые информационные окна
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                
                // Открываем новое информационное окно
                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
                
                // Открываем детали апартамента в колонке
                openApartmentDetails(apartment);
                
                // Выделяем апартамент в списке
                selectApartment(apartment);
            });
            
            // Сохраняем маркер для дальнейшего использования
            apartment.marker = marker;
            apartmentMarkers.push(marker); // Добавляем маркер в массив
        } catch (error) {
            console.error('Ошибка создания маркера для апартамента:', apartment, error);
        }
    });
}

// Очистка маркеров апартаментов
function clearApartmentMarkers() {
    if (!Array.isArray(apartments)) {
        console.warn('apartments не является массивом:', apartments);
        return;
    }
    
    apartments.forEach(apartment => {
        if (apartment.marker) {
            apartment.marker.setMap(null);
            apartment.marker = null;
        }
    });
}

// Создание информационного окна для апартамента
function createApartmentInfoWindow(apartment) {
    return `
        <div class="apartment-info-window">
            <div class="apartment-info-header">
                <h3>${apartment.title || 'Без названия'}</h3>
                <div class="apartment-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(apartment.rating || 0))}${'☆'.repeat(5 - Math.floor(apartment.rating || 0))}</span>
                    <span class="rating-score">${apartment.rating || 0}</span>
                    <span class="review-count">(${apartment.reviewCount || 0})</span>
                </div>
            </div>
            <div class="apartment-info-body">
                <p class="apartment-address">📍 ${apartment.address || 'Адрес не указан'}</p>
                <p class="apartment-details">
                    🛏️ ${apartment.bedrooms || 1} спальни • 🚿 ${apartment.bathrooms || 1} ванные • 👥 до ${apartment.maxGuests || 1} гостей
                </p>
                <p class="apartment-price">💰 ${apartment.pricePerNight || 0} грн/ночь</p>
            </div>
            <button class="btn-view-apartment" onclick="viewApartmentDetails(${apartment.id})">
                Посмотреть детали
            </button>
        </div>
    `;
}

// Отображение списка апартаментов
function displayApartmentsList() {
    const apartmentsList = document.getElementById('apartments-list');
    if (!apartmentsList) return;
    
    apartmentsList.innerHTML = '';
    
    if (!Array.isArray(apartments)) {
        console.warn('apartments не является массивом в displayApartmentsList:', apartments);
        return;
    }
    
    apartments.forEach(apartment => {
        const apartmentCard = createApartmentCard(apartment);
        apartmentsList.appendChild(apartmentCard);
    });
    
    updateApartmentsCount();
}

// Создание карточки апартамента для списка
function createApartmentCard(apartment) {
    // Проверяем, что объект апартамента существует
    if (!apartment || typeof apartment !== 'object') {
        console.warn('Некорректный объект апартамента:', apartment);
        return document.createElement('div'); // Возвращаем пустой div в случае ошибки
    }
    
    const card = document.createElement('div');
    card.className = 'apartment-card';
    card.onclick = () => {
        selectApartment(apartment);
        openApartmentDetails(apartment);
    };
    
    const imageUrl = apartment.imageUrls && apartment.imageUrls.length > 0 
        ? apartment.imageUrls[0] 
        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500';
    
    card.innerHTML = `
        <div class="apartment-image">
            <img src="${imageUrl}" alt="${apartment.title || 'Апартамент'}">
        </div>
        <div class="apartment-info">
            <h3 class="apartment-title">${apartment.title || 'Без названия'}</h3>
            <p class="apartment-address">📍 ${apartment.address || 'Адрес не указан'}</p>
            <div class="apartment-meta">
                <span class="price">${apartment.pricePerNight || 0} грн/ночь</span>
                <span class="rating">⭐ ${apartment.rating || 0}</span>
                <span class="guests">👥 ${apartment.maxGuests || 1}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Фильтрация апартаментов
function filterApartments() {
    if (!Array.isArray(apartments)) {
        console.warn('apartments не является массивом в filterApartments:', apartments);
        return;
    }
    
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const guestsFilter = document.getElementById('guests-filter');
    
    // Проверяем, что элементы фильтров существуют
    if (!priceFilter || !ratingFilter || !guestsFilter) {
        console.warn('Элементы фильтров не найдены');
        return;
    }
    
    const priceValue = priceFilter.value;
    const ratingValue = ratingFilter.value;
    const guestsValue = guestsFilter.value;
    
    const filteredApartments = apartments.filter(apartment => {
        // Фильтр по цене
        if (priceValue && apartment.pricePerNight > parseInt(priceValue)) {
            return false;
        }
        
        // Фильтр по рейтингу
        if (ratingValue && apartment.rating < parseFloat(ratingValue)) {
            return false;
        }
        
        // Фильтр по количеству гостей
        if (guestsValue && apartment.maxGuests < parseInt(guestsValue)) {
            return false;
        }
        
        return true;
    });
    
    displayFilteredApartments(filteredApartments);
}

// Отображение отфильтрованных апартаментов
function displayFilteredApartments(filteredApartments) {
    const apartmentsList = document.getElementById('apartments-list');
    if (!apartmentsList) {
        console.warn('Список апартаментов не найден');
        return;
    }
    
    apartmentsList.innerHTML = '';
    
    filteredApartments.forEach(apartment => {
        const card = createApartmentCard(apartment);
        apartmentsList.appendChild(card);
    });
    
    updateApartmentsCount(filteredApartments.length);
}

// Сброс фильтров
function resetFilters() {
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const guestsFilter = document.getElementById('guests-filter');
    
    // Проверяем, что элементы фильтров существуют
    if (priceFilter) priceFilter.value = '';
    if (ratingFilter) ratingFilter.value = '';
    if (guestsFilter) guestsFilter.value = '';
    
    displayApartmentsList();
}

// Выбор апартамента
function selectApartment(apartment) {
    // Убираем выделение со всех карточек
    const allCards = document.querySelectorAll('.apartment-card');
    if (allCards && allCards.length > 0) {
        allCards.forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    // Добавляем выделение к выбранной карточке
    if (Array.isArray(apartments)) {
        const apartmentCards = document.querySelectorAll('.apartment-card');
        if (apartmentCards && apartmentCards.length > 0) {
            const apartmentIndex = apartments.findIndex(a => a.id === apartment.id);
            if (apartmentIndex !== -1 && apartmentCards[apartmentIndex]) {
                apartmentCards[apartmentIndex].classList.add('selected');
            }
        }
    }
    
    // Центрируем карту на выбранном апартаменте
    if (typeof map !== 'undefined' && map && apartment.latitude && apartment.longitude) {
        map.setCenter({ lat: apartment.latitude, lng: apartment.longitude });
        map.setZoom(15);
    }
    
    selectedApartment = apartment;
}

// Просмотр деталей апартамента
function viewApartmentDetails(apartmentId) {
    if (!Array.isArray(apartments)) {
        console.warn('apartments не является массивом в viewApartmentDetails:', apartments);
        return;
    }
    
    const apartment = apartments.find(a => a.id === apartmentId);
    if (apartment) {
        // Здесь можно открыть модальное окно с детальной информацией
        // или перейти на страницу апартамента
        console.log('Просмотр деталей апартамента:', apartment.title || 'Без названия');
        
        // Пример открытия модального окна
        openApartmentModal(apartment);
    }
}

// Функция для открытия деталей апартамента в колонке
function openApartmentDetails(apartment) {
    // Проверяем, что объект апартамента существует
    if (!apartment || typeof apartment !== 'object') {
        console.warn('Некорректный объект апартамента:', apartment);
        return;
    }
    
    const detailsColumn = document.getElementById('apartment-details-column');
    const detailsContent = document.getElementById('apartment-details-content');
    
    // Проверяем, что элементы существуют
    if (!detailsColumn || !detailsContent) {
        console.warn('Элементы деталей апартамента не найдены');
        return;
    }
    
    // Создаем HTML для деталей апартамента
    const detailsHTML = `
        <div class="apartment-details">
            <div class="apartment-details-images">
                ${apartment.imageUrls && apartment.imageUrls.length > 0 
                    ? `<img src="${apartment.imageUrls[0]}" alt="${apartment.title || 'Апартамент'}" class="main-image">`
                    : '<div class="no-image">Нет изображения</div>'
                }
            </div>
            
            <div class="apartment-details-info">
                <h2 class="apartment-title">${apartment.title || 'Без названия'}</h2>
                <p class="apartment-address">📍 ${apartment.address || 'Адрес не указан'}</p>
                
                <div class="apartment-stats">
                    <div class="stat-item">
                        <span class="stat-label">Цена за ночь:</span>
                        <span class="stat-value price">${apartment.pricePerNight || 0} грн</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Рейтинг:</span>
                        <span class="stat-value rating">⭐ ${apartment.rating || 0}/5</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Макс. гостей:</span>
                        <span class="stat-value guests">👥 ${apartment.maxGuests || 1}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Спальни:</span>
                        <span class="stat-value">🛏️ ${apartment.bedrooms || 1}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Ванные:</span>
                        <span class="stat-value">🚿 ${apartment.bathrooms || 1}</span>
                    </div>
                </div>
                
                <div class="apartment-description">
                    <h3>Описание</h3>
                    <p>${apartment.description || 'Описание отсутствует'}</p>
                </div>
                
                ${apartment.amenities && apartment.amenities.length > 0 ? `
                    <div class="apartment-amenities">
                        <h3>Удобства</h3>
                        <div class="amenities-list">
                            ${apartment.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="apartment-actions">
                    <button class="btn-primary">Забронировать</button>
                    <button class="btn-secondary">Связаться с хозяином</button>
                </div>
            </div>
        </div>
    `;
    
    detailsContent.innerHTML = detailsHTML;
    detailsColumn.classList.add('active');
}

// Функция для закрытия деталей апартамента
function closeApartmentDetails() {
    const detailsColumn = document.getElementById('apartment-details-column');
    if (detailsColumn) {
        detailsColumn.classList.remove('active');
    }
}

// Функция для открытия модального окна (теперь не используется)
function openApartmentModal(apartment) {
    // Вместо модального окна открываем детали в колонке
    openApartmentDetails(apartment);
}

// Закрытие модального окна
function closeApartmentModal() {
    const modal = document.querySelector('.apartment-modal');
    if (modal) {
        modal.remove();
    }
}

// Бронирование апартамента
function bookApartment(apartmentId) {
    if (!Array.isArray(apartments)) {
        console.warn('apartments не является массивом в bookApartment:', apartments);
        return;
    }
    
    const apartment = apartments.find(a => a.id === apartmentId);
    if (apartment) {
        console.log('Бронирование апартамента:', apartment.title || 'Без названия');
        // Здесь можно добавить логику бронирования
        alert(`Бронирование апартамента "${apartment.title || 'Без названия'}" пока не реализовано`);
    }
}

// Обновление счетчика апартаментов
function updateApartmentsCount(count = null) {
    const countElement = document.getElementById('apartments-count');
    if (!countElement) return;
    
    let apartmentCount = 0;
    if (count !== null) {
        apartmentCount = count;
    } else if (Array.isArray(apartments)) {
        apartmentCount = apartments.length;
    } else {
        console.warn('apartments не является массивом в updateApartmentsCount:', apartments);
        apartmentCount = 0;
    }
    
    countElement.textContent = `${apartmentCount} апартаментов`;
}

// Экспорт функций для использования в других файлах
window.apartmentFunctions = {
    initializeApartments,
    loadApartments,
    generateMockApartments,
    loadAllApartments,
    displayApartmentsOnMap,
    displayApartmentsList,
    createApartmentCard,
    selectApartment,
    openApartmentDetails,
    closeApartmentDetails,
    filterApartments,
    resetFilters,
    updateApartmentsCount,
    clearApartmentMarkers
};

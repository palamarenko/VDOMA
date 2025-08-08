let filteredCities = [];
let currentMarker = null; // Текущий маркер на карте

// Выбор города
function selectCity(city, lat, lng) {
    document.getElementById('cityInput').value = city;
    document.getElementById('autocomplete').style.display = 'none';

    // Преобразуем координаты в числа и проверяем их корректность
    const latitude = Number(lat);
    const longitude = Number(lng);
    
    console.log('Выбран город:', city, 'Координаты:', latitude, longitude);
    
    // Проверяем, что координаты являются корректными числами
    if (map && !isNaN(latitude) && !isNaN(longitude) && 
        latitude >= -90 && latitude <= 90 && 
        longitude >= -180 && longitude <= 180) {
        
        // Удаляем предыдущий маркер, если он существует
        if (currentMarker) {
            currentMarker.setMap(null);
        }
        
        // Создаем новый маркер
        currentMarker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: city,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        
        // Плавная анимация перехода к городу
        map.panTo({ lat: latitude, lng: longitude });
        
        // Увеличиваем зум после завершения анимации panTo
        const listener = map.addListener('idle', () => {
            map.setZoom(12);
            google.maps.event.removeListener(listener);
        });
    } else {
        console.error('Некорректные координаты:', lat, lng);
    }
}

// Очистка поля
function clearCity() {
    document.getElementById('cityInput').value = '';
    document.getElementById('cityInput').focus();
    document.getElementById('cityInput').blur();
    
    // Удаляем маркер при очистке поля
    if (currentMarker) {
        currentMarker.setMap(null);
        currentMarker = null;
    }
}

// Глобальная функция для удаления маркера
function removeCityMarker() {
    if (currentMarker) {
        currentMarker.setMap(null);
        currentMarker = null;
    }
}

// Глобальная функция для получения текущего маркера
function getCurrentMarker() {
    return currentMarker;
}

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById('cityInput');
    if (!cityInput) {
        return;
    }

    // Установка курсора в конец при клике
    cityInput.addEventListener('click', function () {
        // Устанавливаем курсор в конец текста
        this.setSelectionRange(this.value.length, this.value.length);
        this.focus();
    });

    // Установка курсора в конец при фокусе
    cityInput.addEventListener('focus', function () {
        // Устанавливаем курсор в конец при фокусе
        this.setSelectionRange(this.value.length, this.value.length);
        filterCities(this.value).then(r => showAutocomplete(this));
    });

    // Установка курсора в конец при вводе текста
    cityInput.addEventListener('input', function () {
        // Устанавливаем курсор в конец после ввода
        setTimeout(() => {
            this.setSelectionRange(this.value.length, this.value.length);
        }, 0);
        filterCities(this.value).then(r => showAutocomplete(this));
    });

    // Скрытие автодополнения при клике вне поля
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.destination')) {
            document.getElementById('autocomplete').style.display = 'none';
            
            // Если поле пустое, удаляем маркер
            const cityInput = document.getElementById('cityInput');
            if (cityInput && cityInput.value.trim() === '') {
                if (currentMarker) {
                    currentMarker.setMap(null);
                    currentMarker = null;
                }
            }
        }
    });
});

// Проверка на ошибки
window.addEventListener('error', function (e) {
    console.error('ОШИБКА JavaScript:', e);
});

// Фильтрация городов по вводу
async function filterCities(input) {
    try {
        if (input.length < 2) {
            filteredCities = [];
            return;
        }

        const response = await fetch(`/api/settlements/search?query=${encodeURIComponent(input)}&limit=10`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Результаты поиска:", data);

        if (data.success) {
            filteredCities = data.results.map(settlement => {
                const city = {
                    name: settlement.name,
                    lat: settlement.latitude || 0,
                    lng: settlement.longitude || 0,
                    type: settlement.type,
                    region: settlement.region,
                    district: settlement.district,
                    population: settlement.population
                };
                console.log("Обработанный город:", city);
                return city;
            });
        } else {
            filteredCities = [];
        }

    } catch (error) {
        console.error("Ошибка при запросе городов:", error);
        filteredCities = [];
    }
}

// Показ автодополнения
function showAutocomplete(input) {
    let dropdown = document.getElementById('autocomplete');

    const rect = input.getBoundingClientRect();

    // Позиционирование под полем ввода
    dropdown.style.position = 'fixed';
    dropdown.style.top = 67 + 'px';
    dropdown.style.left = 25 + 'px';
    dropdown.style.width = rect.width + 100 + 'px';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #e0e0e0';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    dropdown.style.zIndex = '9999';
    dropdown.style.display = 'block';

    if (filteredCities.length > 0) {
        dropdown.innerHTML = filteredCities.map(city => {
            console.log("Отображение города:", city);
            
            // Формируем подзаголовок с информацией о типе и регионе
            let subtitle = city.region || 'Україна';
            if (city.type && city.region) {
                subtitle = `${city.type}, ${city.region}`;
            } else if (city.type) {
                subtitle = city.type;
            } else if (city.region) {
                subtitle = city.region;
            }
            
            console.log("Сформированный подзаголовок:", subtitle);
            
            return `
                <div class="autocomplete-item" onclick="selectCity('${city.name}', ${city.lat}, ${city.lng})">
                    <div class="item-icon">📍</div>
                    <div class="item-content">
                        <div class="item-title">${city.name}</div>
                        <div class="item-subtitle">${subtitle}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        dropdown.style.display = 'none';
    }
}

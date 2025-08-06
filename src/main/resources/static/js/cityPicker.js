let filteredCities = [];

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
        
        // Плавная анимация перехода к городу
        map.panTo({ lat: latitude, lng: longitude });
        
        // Увеличиваем зум после завершения анимации panTo
        const listener = map.addListener('idle', () => {
            map.setZoom(8);
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
        const response = await fetch(`http://127.0.0.1:8080/getCityByName?name=${encodeURIComponent(input)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const cities = await response.json();
        console.log(":", cities);

        filteredCities = cities

    } catch (error) {
        console.error("Ошибка при запросе городов:", error);
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
        dropdown.innerHTML = filteredCities.map(city => `
            <div class="autocomplete-item" onclick="selectCity('${city.name}', ${city.lat}, ${city.lng})">
                <div class="item-icon">📍</div>
                <div class="item-content">
                    <div class="item-title">${city.name}</div>
                    <div class="item-subtitle">Україна</div>
                </div>
            </div>
        `).join('');
    } else {
        dropdown.style.display = 'none';
    }
}

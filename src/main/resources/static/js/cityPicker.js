
const cities = ['Київ', 'Черкаси', 'Харків'];
let filteredCities = [];

// Выбор города
function selectCity(city) {
    document.getElementById('cityInput').value = city;
    document.getElementById('autocomplete').style.display = 'none';
}

// Очистка поля
function clearCity() {
    document.getElementById('cityInput').value = '';
    document.getElementById('cityInput').focus();
    document.getElementById('cityInput').blur();
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    if (!cityInput) {
        return;
    }

    // Установка курсора в конец при клике
    cityInput.addEventListener('click', function() {
        // Устанавливаем курсор в конец текста
        this.setSelectionRange(this.value.length, this.value.length);
        this.focus();
    });

    cityInput.addEventListener('input', function() {
        filterCities(this.value);
        showAutocomplete(this);
    });

    cityInput.addEventListener('focus', function() {
        // Устанавливаем курсор в конец при фокусе
        this.setSelectionRange(this.value.length, this.value.length);
        filterCities(this.value);
        showAutocomplete(this);
    });

    // Скрытие автодополнения при клике вне поля
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.destination')) {
            document.getElementById('autocomplete').style.display = 'none';
        }
    });
});

// Проверка на ошибки
window.addEventListener('error', function(e) {
    console.error('ОШИБКА JavaScript:', e);
});


// Фильтрация городов по вводу
function filterCities(input) {
    const value = input.toLowerCase();
    filteredCities = cities.filter(city =>
        city.toLowerCase().includes(value)
    );
}

// Показ автодополнения
function showAutocomplete(input) {
    let dropdown = document.getElementById('autocomplete');

    const rect = input.getBoundingClientRect();

    // Позиционирование под полем ввода
    dropdown.style.position = 'fixed';
    dropdown.style.top = 67  + 'px';
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
            <div class="autocomplete-item" onclick="selectCity('${city}')">
                <div class="item-icon">📍</div>
                <div class="item-content">
                    <div class="item-title">${city}</div>
                    <div class="item-subtitle">Україна</div>
                </div>
            </div>
        `).join('');
    } else {
        dropdown.style.display = 'none';
    }
}

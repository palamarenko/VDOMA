// Глобальная переменная для количества гостей
let guestsCount = 2;

// Открытие модального окна гостей
function openGuestsModal() {
    document.getElementById('guestsModal').style.display = 'flex';
    updateCounterDisplay();
}

// Закрытие модального окна гостей
function closeGuestsModal() {
    document.getElementById('guestsModal').style.display = 'none';
}

// Увеличение количества гостей
function increaseGuests() {
    if (guestsCount < 20) { // Максимум 20 гостей
        guestsCount++;
        updateCounterDisplay();
    }
}

// Уменьшение количества гостей
function decreaseGuests() {
    if (guestsCount > 1) { // Минимум 1 гость
        guestsCount--;
        updateCounterDisplay();
    }
}

// Обновление отображения счетчика
function updateCounterDisplay() {
    document.getElementById('guestsCount').textContent = guestsCount;
    
    // Обновляем состояние кнопок
    const decreaseBtn = document.querySelector('.counter-btn:first-child');
    const increaseBtn = document.querySelector('.counter-btn:last-child');
    
    decreaseBtn.disabled = guestsCount <= 1;
    increaseBtn.disabled = guestsCount >= 20;
}

// Подтверждение выбора количества гостей
function confirmGuestsSelection() {
    updateGuestsLabel();
    closeGuestsModal();
}

// Обновление лейбла в поисковой строке
function updateGuestsLabel() {
    const guestsLabel = document.getElementById('guestsLabel');
    
    // Правильное склонение слова "гость"
    let guestText;
    if (guestsCount === 1) {
        guestText = 'гость';
    } else if (guestsCount >= 2 && guestsCount <= 4) {
        guestText = 'гості';
    } else {
        guestText = 'гостей';
    }
    
    guestsLabel.textContent = `${guestsCount} ${guestText}`;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateGuestsLabel();
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация галереи изображений
    initImageGallery();
    
    // Инициализация обработчиков событий
    initEventHandlers();
    
    // Инициализация sticky sidebar
    initStickySidebar();
});

// Галерея изображений
function initImageGallery() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    
    let currentImageIndex = 0;
    const images = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ];
    
    // Обработчик клика по миниатюрам
    thumbnails.forEach((thumbnail, index) => {
        if (index < images.length) {
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage();
                updateThumbnailSelection();
            });
        }
    });
    
    // Обработчик кнопки "Предыдущее"
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateMainImage();
            updateThumbnailSelection();
        });
    }
    
    // Обработчик кнопки "Следующее"
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateMainImage();
            updateThumbnailSelection();
        });
    }
    
    // Обновление главного изображения
    function updateMainImage() {
        if (mainImage) {
            mainImage.src = images[currentImageIndex];
            mainImage.alt = `Image ${currentImageIndex + 1}`;
        }
    }
    
    // Обновление выбранной миниатюры
    function updateThumbnailSelection() {
        thumbnails.forEach((thumbnail, index) => {
            if (index < images.length) {
                thumbnail.parentElement.classList.toggle('active', index === currentImageIndex);
            }
        });
    }
    
    // Инициализация первой миниатюры как активной
    updateThumbnailSelection();
}

// Обработчики событий
function initEventHandlers() {
    // Кнопка "Забронировать"
    const bookButtons = document.querySelectorAll('.btn-primary');
    bookButtons.forEach(button => {
        button.addEventListener('click', handleBooking);
    });
    
    // Кнопка "Сохранить жилье"
    const saveButtons = document.querySelectorAll('.btn-secondary');
    saveButtons.forEach(button => {
        button.addEventListener('click', handleSave);
    });
    
    // Кнопки действий (сердце, поделиться)
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleAction);
    });
    
    // Кнопка "Показать на карте"
    const mapButton = document.querySelector('.btn-map');
    if (mapButton) {
        mapButton.addEventListener('click', handleShowMap);
    }
    
    // Ссылка "показать на карте"
    const showMapLink = document.querySelector('.show-map-link');
    if (showMapLink) {
        showMapLink.addEventListener('click', handleShowMap);
    }
}

// Обработка бронирования
function handleBooking(event) {
    event.preventDefault();
    
    // Здесь можно добавить логику для открытия модального окна бронирования
    // или перехода на страницу бронирования
    
    const button = event.target;
    const originalText = button.textContent;
    
    // Анимация загрузки
    button.textContent = 'Обработка...';
    button.disabled = true;
    
    // Имитация API вызова
    setTimeout(() => {
        button.textContent = 'Забронировано!';
        button.style.background = '#059669';
        
        // Возврат к исходному состоянию через 2 секунды
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    }, 1500);
    
    console.log('Попытка бронирования апартамента');
}

// Обработка сохранения
function handleSave(event) {
    event.preventDefault();
    
    const button = event.target;
    const heartIcon = button.querySelector('.fas.fa-heart');
    
    if (heartIcon) {
        // Переключение состояния сохранения
        if (heartIcon.style.color === 'red') {
            heartIcon.style.color = '';
            button.textContent = button.textContent.replace('Сохранено', 'Сохранить жилье');
            showNotification('Жилье удалено из сохраненных', 'info');
        } else {
            heartIcon.style.color = 'red';
            button.textContent = button.textContent.replace('Сохранить жилье', 'Сохранено');
            showNotification('Жилье добавлено в сохраненные', 'success');
        }
    }
    
    console.log('Обработка сохранения апартамента');
}

// Обработка действий (сердце, поделиться)
function handleAction(event) {
    event.preventDefault();
    
    const button = event.target.closest('.btn-icon');
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('fa-heart')) {
        // Обработка кнопки "сердце"
        if (icon.style.color === 'red') {
            icon.style.color = '';
            showNotification('Убрано из избранного', 'info');
        } else {
            icon.style.color = 'red';
            showNotification('Добавлено в избранное', 'success');
        }
    } else if (icon.classList.contains('fa-share')) {
        // Обработка кнопки "поделиться"
        handleShare();
    }
}

// Обработка кнопки "Поделиться"
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Apart Assistant on Smart Plaza',
            text: 'Посмотрите на этот прекрасный апартамент в Киеве!',
            url: window.location.href
        });
    } else {
        // Fallback для браузеров без поддержки Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Ссылка скопирована в буфер обмена', 'success');
        }).catch(() => {
            showNotification('Не удалось скопировать ссылку', 'error');
        });
    }
}

// Обработка показа карты
function handleShowMap(event) {
    event.preventDefault();
    
    // Здесь можно добавить логику для открытия карты
    // Например, открыть модальное окно с картой или перейти на страницу карты
    
    showNotification('Открытие карты...', 'info');
    console.log('Попытка показать карту');
}

// Sticky sidebar
function initStickySidebar() {
    const sidebar = document.querySelector('.sidebar');
    const header = document.querySelector('.header-section');
    
    if (!sidebar || !header) return;
    
    // Функция для обновления sticky позиционирования
    function updateStickyPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = header.offsetHeight;
        const headerBottom = header.offsetTop + headerHeight;
        
        // Если шапка видна, используем небольшой отступ
        if (scrollTop < headerBottom) {
            document.documentElement.style.setProperty('--sticky-top-offset', '20px');
        } else {
            // Если шапка скрыта, используем минимальный отступ
            document.documentElement.style.setProperty('--sticky-top-offset', '0px');
        }
    }
    
    // Обработчик прокрутки с throttling для производительности
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateStickyPosition();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Обработчики событий
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', updateStickyPosition);
    
    // Инициализация позиции
    updateStickyPosition();
}

// Система уведомлений
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Обработчик закрытия
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Обработка ошибок
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showNotification('Произошла ошибка при загрузке страницы', 'error');
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('Произошла ошибка при выполнении операции', 'error');
});

// Глобальная переменная для карты
let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 50.4501, lng: 30.5234 }, // Киев
        zoom: 10,
        gestureHandling: 'greedy', // Позволяет скроллить карту без Ctrl
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
}

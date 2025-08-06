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

    // Добавляем маркеры для городов
    const citiesData = [
        { name: 'Київ', lat: 50.4501, lng: 30.5234 },
        { name: 'Черкаси', lat: 49.4444, lng: 32.0598 },
        { name: 'Харків', lat: 49.9935, lng: 36.2304 }
    ];

    citiesData.forEach(city => {
        new google.maps.Marker({
            position: { lat: city.lat, lng: city.lng },
            map: map,
            title: city.name,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(30, 30)
            }
        });
    });
}

# База данных населенных пунктов Украины

## Описание

Система использует файл `divisionUk.zstd` для создания базы данных населенных пунктов Украины. Данные автоматически загружаются при первом запуске приложения.

## Структура данных

### Модель SettlementModel
- `id` - уникальный идентификатор
- `name` - название населенного пункта
- `type` - тип населенного пункта (город, село, поселок и т.д.)
- `region` - область
- `district` - район
- `latitude` - широта
- `longitude` - долгота
- `population` - население
- `searchName` - название для поиска (в нижнем регистре)

## API Endpoints

### Поиск населенных пунктов
```
GET /api/settlements/search?query=Київ&limit=10
```

### Получение по точному названию
```
GET /api/settlements/by-name?name=Київ
```

### Поиск по региону
```
GET /api/settlements/by-region?region=Київська&limit=50
```

### Загрузка данных из файла
```
POST /api/settlements/load-data
```

### Очистка базы данных
```
DELETE /api/settlements/clear
```

### Статистика
```
GET /api/settlements/statistics
```

## Тестовые endpoints

### Проверка работы базы данных
```
GET /api/test/settlements
```

### Тестовый поиск
```
GET /api/test/search?query=Київ
```

## Интеграция с frontend

### Обновленный cityPicker.js
Файл `cityPicker.js` теперь использует новую базу данных:

1. **Поиск**: `filterCities()` отправляет запросы на `/api/settlements/search`
2. **Отображение**: Показывает название, тип и регион населенного пункта
3. **Координаты**: Использует latitude/longitude для центрирования карты

### Пример использования
```javascript
// Поиск городов
const response = await fetch('/api/settlements/search?query=Київ&limit=10');
const data = await response.json();

// Результат содержит:
// - name: название
// - type: тип населенного пункта
// - region: область
// - latitude/longitude: координаты
// - population: население
```

## Загрузка данных

### Автоматическая загрузка
При первом запуске приложения данные автоматически загружаются из файла `divisionUk.zstd`.

### Ручная загрузка
```bash
# Запуск приложения
./gradlew bootRun

# Проверка загрузки данных
curl http://localhost:8080/api/settlements/statistics

# Принудительная загрузка
curl -X POST http://localhost:8080/api/settlements/load-data
```

## Формат файла divisionUk.zstd

Файл должен содержать данные в формате TSV (Tab-Separated Values):

```
Название    Тип    Область    Район    Широта    Долгота    Население
Київ       місто  Київська   -        50.4501   30.5234    2967360
```

## Производительность

### Оптимизации
1. **Индексы**: Автоматически создаются индексы для полей поиска
2. **Пакетная загрузка**: Данные загружаются пакетами по 1000 записей
3. **Поиск**: Использует оптимизированные SQL запросы с LIKE

### Рекомендации
- Для больших файлов (>100MB) увеличьте память JVM: `-Xmx2g`
- Для продакшена используйте PostgreSQL вместо H2

## Устранение неполадок

### Проблема: Файл не найден
```
Файл divisionUk.zstd не найден в корне проекта
```
**Решение**: Убедитесь, что файл находится в корне проекта.

### Проблема: Ошибка парсинга
```
Ошибка при парсинге строки: ...
```
**Решение**: Проверьте формат файла - должен быть TSV.

### Проблема: Медленная загрузка
**Решение**: 
1. Увеличьте память JVM
2. Используйте SSD диск
3. Разбейте большой файл на части

## Мониторинг

### Логи
```
logging.level.com.example.demo.back.service.SettlementService=INFO
```

### H2 Console
```
http://localhost:8080/h2-console
```
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Примеры запросов

### Поиск городов
```sql
SELECT * FROM settlements 
WHERE LOWER(name) LIKE '%київ%' 
ORDER BY population DESC;
```

### Статистика по регионам
```sql
SELECT region, COUNT(*) as count 
FROM settlements 
GROUP BY region 
ORDER BY count DESC;
```

### Населенные пункты с координатами
```sql
SELECT name, latitude, longitude 
FROM settlements 
WHERE latitude IS NOT NULL 
AND longitude IS NOT NULL;
```

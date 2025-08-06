// Переменные для календаря
var selectedStartDate = true

let currentMonth = new Date().getMonth(); // Текущий месяц (0-based)
let currentYear = new Date().getFullYear(); // Текущий год

// Функция для вычисления ближайших выходных (пятница-воскресенье)
function getNextWeekend() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота

    let daysUntilFriday = 0;

    if (currentDay <= 5) { // Понедельник - пятница
        daysUntilFriday = 5 - currentDay;
    } else { // Суббота или воскресенье
        daysUntilFriday = 5 + (7 - currentDay);
    }

    const friday = new Date(today);
    friday.setDate(today.getDate() + daysUntilFriday);
    friday.setHours(0, 0, 0, 0);

    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    sunday.setHours(0, 0, 0, 0);

    return { startDate: friday, endDate: sunday };
}

// Инициализируем даты на ближайшие выходные
const weekend = getNextWeekend();
let startDate = weekend.startDate;
let endDate = weekend.endDate;

// Обновляем отображение дат сразу при инициализации
updateDateDisplay();

// Функции для календаря
function openCalendar() {
    document.getElementById('calendarModal').style.display = 'flex';
    generateCalendar();
}

function closeCalendar() {
    document.getElementById('calendarModal').style.display = 'none';
}

function generateCalendar() {
    const septemberDays = document.getElementById('septemberDays');
    septemberDays.innerHTML = '';

    const firstMonth = new Date(currentYear, currentMonth, 1);
    const lastMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDay = firstMonth.getDay();

    // Добавляем пустые дни в начале
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        septemberDays.innerHTML += '<div class="day other-month"></div>';
    }

    // Добавляем дни текущего месяца
    for (let day = 1; day <= lastMonth.getDate(); day++) {
        let className =    getDayName(currentYear, currentMonth, day);
        septemberDays.innerHTML += `<div class="day ${className}" onclick="selectDate(${day}, ${lastMonth.getMonth()}, ${currentYear})">${day}</div>`;
    }

    // Генерируем дни для следующего месяца
    const octoberDays = document.getElementById('octoberDays');
    octoberDays.innerHTML = '';

    // Правильно вычисляем следующий месяц и год
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear = currentYear + 1;
    }

    const secondMonth = new Date(nextYear, nextMonth, 1);
    const secondMonthLast = new Date(nextYear, nextMonth + 1, 0);
    const secondMonthFirstDay = secondMonth.getDay();

    // Добавляем пустые дни в начале второго месяца
    for (let i = 0; i < (secondMonthFirstDay === 0 ? 6 : secondMonthFirstDay - 1); i++) {
        octoberDays.innerHTML += '<div class="day other-month"></div>';
    }

    // Добавляем дни второго месяца
    for (let day = 1; day <= secondMonthLast.getDate(); day++) {
        let monthNumber= secondMonthLast.getMonth()
        let className =    getDayName(nextYear, monthNumber, day);
        octoberDays.innerHTML += `<div class="day ${className}" onclick="selectDate(${day}, ${monthNumber},${nextYear})">${day}</div>`;
    }

    // Обновляем заголовки месяцев
    updateMonthTitles();
}


function getDayName(currentYear, currentMonth, currentDay) {
    let className = 'day';


    let currentDate = new Date(currentYear, currentMonth, currentDay)


    if(endDate == null && startDate.getTime() === currentDate.getTime()){
        className += ' selected';
    }

    if (endDate != null && startDate.getTime() < endDate.getTime() && startDate.getTime() <= currentDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
        if (startDate.getTime() === currentDate.getTime() || endDate.getTime() === currentDate.getTime()) {
            className += ' selected';
        } else {
            className += ' range';
        }
    }
    return className
}




function updateMonthTitles() {
    const monthNames = [
        'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
        'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'
    ];

    const titles = document.querySelectorAll('.month-title');
    titles[0].textContent = `${monthNames[currentMonth]} ${currentYear} р.`;

    // Исправляем проблему с 13-м месяцем
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear = currentYear + 1;
    }
    titles[1].textContent = `${monthNames[nextMonth]} ${nextYear} р.`;
}

function selectDate(day, month, year) {

    if(selectedStartDate){
        startDate = new Date(year,month,day,0,0,0,0)
        endDate = null
    }else {
        endDate = new Date(year,month,day,0,0,0,0)

        if(endDate.getTime() < startDate.getTime()){
            console.log(`HELLO ${startDate} ${endDate}`)
            let tempDate = startDate
            startDate = endDate
            endDate = tempDate

            console.log(`REPLACE ${startDate} ${endDate}`)
        }

    }
    selectedStartDate = !selectedStartDate
    // Логика выбора даты
    console.log(`Выбрана дата: ${day} ${month}`);
    generateCalendar();
}

function confirmDateSelection() {
    // Обновляем отображение выбранных дат в поисковой строке
    updateDateDisplay();
    
    // Закрываем календарь
    closeCalendar();
    
    // Сбрасываем флаг выбора даты
    selectedStartDate = true;
}

function updateDateDisplay() {
    if (startDate && endDate) {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const startWeekday = getWeekdayName(startDate.getDay());
        const endWeekday = getWeekdayName(endDate.getDay());
        const startMonth = getMonthName(startDate.getMonth());
        const endMonth = getMonthName(endDate.getMonth());
        
        const dateLabel = document.querySelector('.dates .label');
        dateLabel.textContent = `${startWeekday}, ${startDay} ${startMonth} — ${endWeekday}, ${endDay} ${endMonth}`;
    }
}

function getWeekdayName(dayIndex) {
    const weekdayNames = [
        'вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'
    ];
    return weekdayNames[dayIndex];
}

function getMonthName(monthIndex) {
    const monthNames = [
        'січ.', 'лют.', 'бер.', 'квіт.', 'трав.', 'черв.',
        'лип.', 'серп.', 'вер.', 'жовт.', 'лист.', 'груд.'
    ];
    return monthNames[monthIndex];
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
} 
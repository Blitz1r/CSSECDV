const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const todayDate = new Date();
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let isWeeklyView = false;

//Sample bookings
const bookings = [
    { date: new Date(currentYear, currentMonth, 7), time: '7:30 AM', description: 'Private tour for a corporate group', type: 'pickup' },
    { date: new Date(currentYear, currentMonth, 7), time: '8:00 AM', description: 'Tagaytay City', type: 'departure' },
    { date: new Date(currentYear, currentMonth, 15), time: '2:00 PM', description: 'WH Taft', type: 'pickup' },
    { date: new Date(currentYear, currentMonth, 25), time: '9:00 AM', description: 'Baguio City', type: 'departure' },
];

function calendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    if (isWeeklyView) {
        WeeklyView();
    } else {
        MonthlyView();
    }
}

function MonthlyView() {
    document.getElementById("month-year").textContent = `${months[currentMonth]} ${currentYear}`;
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendar = document.getElementById('calendar');
    calendar.style.gridTemplateColumns = 'repeat(7, 1fr)';
    calendar.innerHTML = `
<div class="calendar-top"><strong>Sunday</strong></div>
<div class="calendar-top"><strong>Monday</strong></div>
<div class="calendar-top"><strong>Tuesday</strong></div>
<div class="calendar-top"><strong>Wednesday</strong></div>
<div class="calendar-top"><strong>Thursday</strong></div>
<div class="calendar-top"><strong>Friday</strong></div>
<div class="calendar-top"><strong>Saturday</strong></div>
`;

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day');
        calendar.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.innerHTML = `<h3>${day}</h3>`;

        //bookings for the month view
        bookings.forEach(booking => {
            if (booking.date.getDate() === day && booking.date.getMonth() === currentMonth && booking.date.getFullYear() === currentYear) {
                const bookingDiv = document.createElement('div');
                bookingDiv.classList.add('booking');
                bookingDiv.textContent = `${booking.time} - ${booking.description} (${booking.type})`;
                dayDiv.appendChild(bookingDiv);
            }
        });

        calendar.appendChild(dayDiv);
    }
}

function WeeklyView() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    document.getElementById("month-year").textContent = `${months[weekStart.getMonth()]} ${weekStart.getFullYear()} - Weekly View`;

    const daysOfWeek = ["Time", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let i = 0; i < daysOfWeek.length; i++) {
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('calendar-top');
        headerDiv.style.textAlign = 'center';

        if (i === 0) {
            headerDiv.innerHTML = `<strong>${daysOfWeek[i]}</strong>`;
        } else {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i - 1);
            headerDiv.innerHTML = `<strong>${daysOfWeek[i]}</strong><br><br><strong>${dayDate.getDate()}</strong>`;
        }

        calendar.appendChild(headerDiv);
    }

    for (let hour = 1; hour <= 24; hour++) {
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const amPm = hour < 12 || hour === 24 ? 'AM' : 'PM';

        const timeSlot = document.createElement("div");
        timeSlot.classList.add("time-slot");
        timeSlot.innerHTML = `<strong>${displayHour}:00 ${amPm}</strong>`;
        calendar.appendChild(timeSlot);

        for (let i = 0; i < 7; i++) {
            const slotCell = document.createElement("div");
            slotCell.classList.add("calendar-week-cell");

            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);

            const timeFormatted = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;

            //bookings for the weekly view (can only display bookings without minutes)
            bookings.forEach(booking => {
                if (booking.date.toDateString() === dayDate.toDateString() && booking.time === timeFormatted) {
                    slotCell.textContent = `${booking.time} - ${booking.description} (${booking.type})`;
                    slotCell.classList.add('has-booking');
                }
            });

            calendar.appendChild(slotCell);
        }
    }

    calendar.classList.add('calendar-weekly');
    calendar.style.gridTemplateColumns = '1fr repeat(7, 1fr)';
}

function navigate(direction) {
    if (isWeeklyView) {
        currentDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        currentDate = new Date(currentYear, currentMonth, 1);
    }
    calendar();
}

function today() {
    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    calendar();
}

function sidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('minimized');
}

function setView(view) {
    isWeeklyView = (view === 'week');
    calendar();
}

calendar();

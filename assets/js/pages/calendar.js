/**
 * AfterTime Calendar JavaScript
 * Handles calendar rendering and task management
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const calendarGrid = document.querySelector('.calendar-grid');
    const monthYearElement = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectedDateElement = document.getElementById('selected-date');
    const tasksContainer = document.getElementById('tasks-container');
    const multiTaskBtn = document.getElementById('add-multi-task');
    const taskModal = document.getElementById('task-modal');
    const multiTaskModal = document.getElementById('multi-task-modal');
    const closeModal = document.querySelector('.close-modal');
    const closeMultiModal = document.querySelector('.close-multi-modal');
    const cancelButton = document.getElementById('cancel-button');
    const cancelMultiBtn = document.getElementById('cancel-multi-button');
    const taskForm = document.getElementById('task-form');
    const multiTaskForm = document.getElementById('multi-task-form');
    const dailyScheduleContainer = document.getElementById('daily-schedule-container');
    const dailySchedule = document.getElementById('daily-schedule');
    const manageList = document.getElementById('manage-list');

    // --- date tracking ---
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;

    // Fallback mode flag (true => use localStorage instead of API)
    let useLocal = false;
    const LS_KEY = 'aftertime_tasks_v1';

    // ---------------- Local Storage Helpers ----------------
    function loadAllLocal() {
        try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
    }
    function saveAllLocal(tasks) { localStorage.setItem(LS_KEY, JSON.stringify(tasks)); }
    function getLocalTasksByDate(date) { return loadAllLocal().filter(t => t.task_date === date); }
    function getLocalTask(id) { return loadAllLocal().find(t => String(t.id) === String(id)); }
    function createLocalTask(data) {
        const tasks = loadAllLocal();
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
        const task = { id, ...data };
        tasks.push(task); saveAllLocal(tasks); return task;
    }
    function updateLocalTask(data) {
        const tasks = loadAllLocal();
        const idx = tasks.findIndex(t => String(t.id) === String(data.id));
        if (idx !== -1) { tasks[idx] = { ...tasks[idx], ...data }; saveAllLocal(tasks); return tasks[idx]; }
        return null;
    }
    function deleteLocalTask(id) {
        const tasks = loadAllLocal().filter(t => String(t.id) !== String(id));
        saveAllLocal(tasks);
    }

    // Health check to decide API vs local
    (function detectBackend(){
        fetch('api/tasks.php?health=1', { cache: 'no-store' })
            .then(r => r.json())
            .then(() => {
                useLocal = false;
                updateModeBadge();
                // Ensure counts are loaded after mode is determined
                refreshDayCounts(currentYear, currentMonth);
            })
            .catch(() => {
                useLocal = true;
                updateModeBadge();
                console.info('[Calendar] API not available – using localStorage mode.');
                // Also load counts in local mode
                refreshDayCounts(currentYear, currentMonth);
            });
    })();

    const modeBadge = document.getElementById('storage-mode');
    function updateModeBadge(){
        if(!modeBadge) return;
        modeBadge.textContent = useLocal ? 'LOCAL' : 'SERVER';
        modeBadge.style.background = useLocal ? 'rgba(255,165,0,.15)' : 'rgba(0,255,170,.15)';
        modeBadge.style.color = useLocal ? '#ffa500' : '#00ffc8';
    }

    // Initialize calendar and event listeners
    initCalendar();

    // Initialize calendar and render current month
    function initCalendar() {
        renderCalendar(currentMonth, currentYear);
        setupEventListeners();
        initDailySchedule();
        setTimeout(autoSelectToday, 200); // Added delay to ensure calendar is fully rendered first
    }

    function autoSelectToday() {
        const today = new Date();
        if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
            const dateString = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;
            const dayEl = calendarGrid.querySelector(`.calendar-day[data-date="${dateString}"]:not(.other-month)`);
            if (dayEl) {
                console.log("Auto-selecting today:", dateString);
                selectDate(dateString, dayEl);
            }
        }
    }

    // Set up all event listeners
    function setupEventListeners() {
        prevMonthBtn.addEventListener('click', previousMonth);
        nextMonthBtn.addEventListener('click', nextMonth);
        multiTaskBtn.addEventListener('click', openMultiTaskModal);
        closeModal.addEventListener('click', closeTaskModal);
        cancelButton.addEventListener('click', closeTaskModal);
        taskForm.addEventListener('submit', saveTask);

        if (multiTaskBtn) {
            multiTaskBtn.addEventListener('click', openMultiTaskModal);
        }
        if (closeMultiModal) {
            closeMultiModal.addEventListener('click', closeMultiTaskModal);
        }
        if (cancelMultiBtn) {
            cancelMultiBtn.addEventListener('click', closeMultiTaskModal);
        }
        if (multiTaskForm) {
            multiTaskForm.addEventListener('submit', saveMultiTask);
        }

        // Close modals when clicking outside content
        window.addEventListener('click', function(event) {
            if (event.target === taskModal) {
                closeTaskModal();
            }
            if (event.target === multiTaskModal) {
                closeMultiTaskModal();
            }
        });
    }

    // Navigate to previous month
    function previousMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    }

    // Navigate to next month
    function nextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    }

    // Render calendar for given month and year
    function renderCalendar(month, year) {
        // Update header month/year text
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;

        // Clear existing calendar days (but keep the weekday headers)
        const weekdayHeaders = Array.from(calendarGrid.querySelectorAll('.weekday-header'));
        calendarGrid.innerHTML = '';

        // Add weekday headers back
        weekdayHeaders.forEach(header => {
            calendarGrid.appendChild(header);
        });

        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get days from previous month to display
        const prevMonth = month - 1 < 0 ? 11 : month - 1;
        const prevYear = prevMonth === 11 ? year - 1 : year;
        const prevMonthDays = new Date(year, month, 0).getDate();

        // Create grid with days in the traditional Sunday to Saturday format
        // Add previous month days to fill the first week
        for (let i = 0; i < firstDay; i++) {
            const day = prevMonthDays - firstDay + i + 1;
            createDayElement(day, prevMonth, prevYear, true);
        }

        // Add current month days
        for (let i = 1; i <= daysInMonth; i++) {
            createDayElement(i, month, year, false);
        }

        // Calculate and add days from next month to complete the grid
        const totalDaysDisplayed = firstDay + daysInMonth;
        const nextMonthDays = 7 - (totalDaysDisplayed % 7);

        if (nextMonthDays < 7) { // Don't add a row if the month ends perfectly on Saturday
            const nextMonth = month + 1 > 11 ? 0 : month + 1;
            const nextYear = nextMonth === 0 ? year + 1 : year;

            for (let i = 1; i <= nextMonthDays; i++) {
                createDayElement(i, nextMonth, nextYear, true);
            }
        }
        // After building the month, update counts
        refreshDayCounts(year, month);
    }

    function refreshDayCounts(year, month) {
        const monthIndex = month; // 0-based
        const y = year;
        if (useLocal) {
            const all = loadAllLocal();
            const counts = {};
            all.forEach(t => {
                if (!t.task_date) return;
                const [yy, mm, dd] = t.task_date.split('-');
                if (parseInt(yy) === y && (parseInt(mm) - 1) === monthIndex) {
                    counts[t.task_date] = (counts[t.task_date] || 0) + 1;
                }
            });
            applyCounts(counts);
            return;
        }
        // Server mode
        fetch(`api/tasks.php?counts=1&year=${y}&month=${monthIndex + 1}`)
            .then(r => { if(!r.ok) throw new Error(); return r.json(); })
            .then(counts => applyCounts(counts))
            .catch(() => { /* ignore on failure */ });
    }

    function applyCounts(countsObj) {
        const dayEls = calendarGrid.querySelectorAll('.calendar-day');
        dayEls.forEach(el => {
            const date = el.dataset.date;
            const count = countsObj && countsObj[date] ? countsObj[date] : 0;
            const badge = el.querySelector('.events-count');
            if (badge) {
                badge.dataset.count = String(count);
                badge.textContent = count > 0 ? count : '';
            }
        });
    }

    function updateDayBadge(date, count){
        const badge = calendarGrid.querySelector(`.calendar-day[data-date="${date}"] .events-count`);
        if (!badge) return;
        badge.textContent = count > 0 ? count : '';
        badge.dataset.count = String(count);
    }

    function recomputeDayCount(date){
        if (!date) return;
        if (useLocal){
            const n = getLocalTasksByDate(date).length;
            updateDayBadge(date, n);
            return;
        }
        // If currently selected date equals date, we already have tasks in the panel
        if (selectedDate === date && tasksContainer){
            const n = tasksContainer.querySelectorAll('.task-item').length;
            updateDayBadge(date, n);
            return;
        }
        fetch(`api/tasks.php?date=${date}`)
            .then(r=> r.ok ? r.json(): [])
            .then(list => updateDayBadge(date, Array.isArray(list)? list.length:0))
            .catch(()=>{});
    }

    // Create a single day element for the calendar
    function createDayElement(day, month, year, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }

        // Check if this day is today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear() && !isOtherMonth) {
            dayElement.classList.add('today');
        }

        // Date string for data attribute (YYYY-MM-DD)
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dayElement.dataset.date = dateString;

        // Create day content container
        const dayContent = document.createElement('div');
        dayContent.className = 'day-content';

        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayContent.appendChild(dayNumber);

        // Event count indicator (will be populated later)
        const eventsCount = document.createElement('div');
        eventsCount.className = 'events-count';
        eventsCount.dataset.count = '0';
        dayContent.appendChild(eventsCount);

        dayElement.appendChild(dayContent);
        calendarGrid.appendChild(dayElement);

        // Add click event listener to day element
        dayElement.addEventListener('click', function() {
            selectDate(dateString, this);
        });
    }

    // Select a date and show tasks for that date
    function selectDate(dateString, element) {
        // Remove selected class from any previously selected day
        const prevSelected = document.querySelector('.calendar-day.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }

        // Add selected class to clicked day
        element.classList.add('selected');

        // Update selected date
        selectedDate = dateString;

        // Format the date for display
        const [year, month, day] = dateString.split('-');
        const dateObj = new Date(year, month - 1, day);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateElement.textContent = dateObj.toLocaleDateString('en-US', options);

        // Enable add task button
        if (multiTaskBtn) {
            multiTaskBtn.disabled = false;
        }

        // Fetch and display tasks for this date
        fetchTasks(dateString);

        // Update daily schedule
        renderDailySchedule(dateString);
        dailyScheduleContainer.style.display = 'block';
    }

    // Initialize the daily schedule with empty hour slots
    function initDailySchedule() {
        dailySchedule.innerHTML = '';

        // Create 24-hour slots (0-23)
        for (let hour = 0; hour < 24; hour++) {
            const hourSlot = document.createElement('div');
            hourSlot.className = 'hour-slot';
            hourSlot.dataset.hour = hour;

            const hourLabel = document.createElement('div');
            hourLabel.className = 'hour-label';

            // Format hour label (12-hour format with AM/PM)
            const hourDisplay = hour % 12 === 0 ? 12 : hour % 12;
            const amPm = hour < 12 ? 'AM' : 'PM';
            hourLabel.textContent = `${hourDisplay} ${amPm}`;

            hourSlot.appendChild(hourLabel);
            dailySchedule.appendChild(hourSlot);
        }
    }

    // Render events in the daily schedule
    function renderDailySchedule(dateString) {
        const existingEvents = dailySchedule.querySelectorAll('.scheduled-event');
        existingEvents.forEach(event => event.remove());
        if (useLocal) { placeTasks(getLocalTasksByDate(dateString)); return; }
        fetch(`api/tasks.php?date=${dateString}`)
            .then(r => { if(!r.ok) throw new Error(); return r.json(); })
            .then(tasks => placeTasks(tasks))
            .catch(() => {});
    }

    // Place tasks on the daily schedule
    function placeTasks(tasks) {
        if (!tasks || tasks.length === 0) return;
        tasks.forEach(task => {
            if (!task.task_time) return;
            const startTime = task.task_time;
            const endTime = task.end_time || addHourToTime(startTime);
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            const startPercent = (startHour + startMinute / 60) / 24 * 100;
            const endPercent = (endHour + endMinute / 60) / 24 * 100;
            const durationPercent = endPercent - startPercent;
            const eventEl = document.createElement('div');
            eventEl.className = 'scheduled-event';
            eventEl.dataset.id = task.id;
            eventEl.style.top = `${startPercent}%`;
            eventEl.style.height = `${durationPercent}%`;
            eventEl.style.left = '0';
            eventEl.style.right = '0.5rem';

            // Create title element
            const titleEl = document.createElement('div');
            titleEl.className = 'scheduled-event-title';
            titleEl.textContent = task.title;
            eventEl.appendChild(titleEl);

            // Add the time display back
            const timeEl = document.createElement('div');
            timeEl.className = 'scheduled-event-time';
            timeEl.textContent = formatTimeRange(startTime, endTime);
            eventEl.appendChild(timeEl);

            // Create delete button and position at the right
            const delBtn = document.createElement('button');
            delBtn.className = 'scheduled-event-delete';
            delBtn.type = 'button';
            delBtn.textContent = '×';
            delBtn.style.position = 'absolute';
            delBtn.style.right = '3px';
            delBtn.style.top = '3px';
            delBtn.addEventListener('click',(ev)=>{ ev.stopPropagation(); if(confirm('Delete this task?')) deleteTaskFromServer(task.id); });
            eventEl.appendChild(delBtn);

            // Add event listener for editing
            eventEl.addEventListener('click', () => { openEditTaskModal(task.id); });
            dailySchedule.appendChild(eventEl);
        });
    }

    // Helper to format time range for display
    function formatTimeRange(start, end) {
        const formatTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const h = hours % 12 || 12;
            const ampm = hours < 12 ? 'AM' : 'PM';
            return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        };

        return `${formatTime(start)} - ${formatTime(end)}`;
    }

    // Helper to add one hour to a time string (for default end time)
    function addHourToTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const newHours = (hours + 1) % 24;
        return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Update manage list for the selected date
    function updateManageList(tasks) {
        if (!manageList) return;
        if (!selectedDate) { manageList.innerHTML = 'Select a date'; return; }
        if (!tasks || tasks.length === 0) {
            manageList.innerHTML = '<div class="manage-empty">No activities</div>';
            return;
        }
        // Sort by time (null times last)
        tasks.sort((a,b)=>{
            if(!a.task_time && !b.task_time) return 0;
            if(!a.task_time) return 1;
            if(!b.task_time) return -1;
            return a.task_time.localeCompare(b.task_time);
        });
        manageList.innerHTML = tasks.map(t => {
            const timeStr = t.task_time ? (t.end_time ? `${t.task_time} - ${t.end_time}` : t.task_time) : '—';
            return `<div class="manage-item" data-id="${t.id}">
                        <div class="manage-item-title">${t.title || '(No title)'}</div>
                        <div class="manage-item-time">${timeStr}</div>
                        <div class="manage-item-actions">
                            <button class="manage-btn delete" data-act="del" data-id="${t.id}">DEL</button>
                        </div>
                    </div>`;
        }).join('');
        // Attach listeners (event delegation)
        manageList.querySelectorAll('.manage-btn').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                const id = e.currentTarget.getAttribute('data-id');
                const act = e.currentTarget.getAttribute('data-act');
                if (act === 'del') {
                    if (confirm('Delete this task?')) deleteTaskFromServer(id);
                }
            });
        });
    }

    // Fetch tasks for a specific date
    function fetchTasks(date) {
        return new Promise(resolve => {
            // Clear any existing tasks first to prevent duplicates
            if (tasksContainer) {
                tasksContainer.innerHTML = '<p class="loading">Loading tasks...</p>';
            }

            if (useLocal) {
                const tasks = getLocalTasksByDate(date);
                displayTasks(tasks);
                placeTasks(tasks);
                updateManageList(tasks);
                if (selectedDate === date) updateDayBadge(date, tasks.length);
                resolve(tasks);
                return;
            }

            fetch(`api/tasks.php?date=${date}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network');
                    return response.json();
                })
                .then(tasks => {
                    // Always clear existing tasks first
                    if (tasksContainer) {
                        tasksContainer.innerHTML = '';
                    }

                    // Display the tasks
                    displayTasks(tasks);

                    // Clear and re-render daily schedule
                    const existingEvents = dailySchedule.querySelectorAll('.scheduled-event');
                    existingEvents.forEach(event => event.remove());
                    placeTasks(tasks);

                    // Update management list
                    updateManageList(tasks);

                    // Update badge count
                    if (selectedDate === date) updateDayBadge(date, tasks.length);

                    resolve(tasks);
                })
                .catch(() => {
                    if (tasksContainer) {
                        tasksContainer.innerHTML = '<p class="no-tasks-message">No tasks for this date</p>';
                    }
                    updateManageList([]);
                    if (selectedDate === date) updateDayBadge(date, 0);
                    resolve([]);
                });
        });
    }

    // Display tasks in the tasks panel
    function displayTasks(tasks) {
        if (!tasksContainer) return;

        if (!tasks || tasks.length === 0) {
            tasksContainer.innerHTML = '<p class="no-tasks-message">No tasks for this date</p>';
            return;
        }

        let tasksHTML = '';

        tasks.forEach(task => {
            // Format time display if available
            let timeDisplay = '';
            if (task.task_time) {
                if (task.end_time) {
                    timeDisplay = formatTimeRange(task.task_time, task.end_time);
                } else {
                    timeDisplay = formatTime(task.task_time);
                }
            }

            tasksHTML += `
                <div class="task-item" data-id="${task.id}">
                    <div class="task-item-header">
                        <div class="task-title">${task.title}</div>
                        ${timeDisplay ? `<div class="task-time">${timeDisplay}</div>` : ''}
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
            `;
        });

        tasksContainer.innerHTML = tasksHTML;
    }

    // Format time for display (12-hour format)
    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const h = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    // Multi-day selector functionality
    let multiSelectorMonth = currentDate.getMonth();
    let multiSelectorYear = currentDate.getFullYear();
    const selectedDates = new Set(); // Store selected dates
    const multiMonthYearElement = document.getElementById('multi-month-year');
    const multiPrevMonthBtn = document.getElementById('multi-prev-month');
    const multiNextMonthBtn = document.getElementById('multi-next-month');
    const multiDayGrid = document.querySelector('.multi-day-grid');
    const selectAllVisibleBtn = document.getElementById('select-all-visible');
    const clearSelectionBtn = document.getElementById('clear-selection');
    const selectedDatesCountElement = document.getElementById('selected-dates-count');
    const selectedDatesInput = document.getElementById('selected-dates');

    function renderMultiDaySelector() {
        if (!multiMonthYearElement || !multiDayGrid) return;

        // Update header month/year text
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        multiMonthYearElement.textContent = `${monthNames[multiSelectorMonth]} ${multiSelectorYear}`;

        // Clear existing calendar days (but keep the weekday headers)
        const weekdayHeaders = Array.from(multiDayGrid.querySelectorAll('.mini-weekday-header'));
        multiDayGrid.innerHTML = '';

        // Add weekday headers back
        weekdayHeaders.forEach(header => {
            multiDayGrid.appendChild(header);
        });

        // Get first day of month and total days in month
        const firstDay = new Date(multiSelectorYear, multiSelectorMonth, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysInMonth = new Date(multiSelectorYear, multiSelectorMonth + 1, 0).getDate();

        // Get days from previous month to display
        const prevMonth = multiSelectorMonth - 1 < 0 ? 11 : multiSelectorMonth - 1;
        const prevYear = prevMonth === 11 ? multiSelectorYear - 1 : multiSelectorYear;
        const prevMonthDays = new Date(multiSelectorYear, multiSelectorMonth, 0).getDate();

        // Create grid with days (add previous month days to fill the first week)
        for (let i = 0; i < firstDay; i++) {
            const day = prevMonthDays - firstDay + i + 1;
            createMultiDayElement(day, prevMonth, prevYear, true);
        }

        // Add current month days
        for (let i = 1; i <= daysInMonth; i++) {
            createMultiDayElement(i, multiSelectorMonth, multiSelectorYear, false);
        }

        // Calculate and add days from next month to complete the grid
        const totalDaysDisplayed = firstDay + daysInMonth;
        const nextMonthDays = 7 - (totalDaysDisplayed % 7);

        if (nextMonthDays < 7) { // Don't add a row if the month ends perfectly on Saturday
            const nextMonth = multiSelectorMonth + 1 > 11 ? 0 : multiSelectorMonth + 1;
            const nextYear = nextMonth === 0 ? multiSelectorYear + 1 : multiSelectorYear;

            for (let i = 1; i <= nextMonthDays; i++) {
                createMultiDayElement(i, nextMonth, nextYear, true);
            }
        }

        // Update selected dates count
        updateSelectedDatesCount();
    }

    function createMultiDayElement(day, month, year, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'mini-day';
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }

        // Check if this day is today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear() && !isOtherMonth) {
            dayElement.classList.add('today');
        }

        // Date string for data attribute (YYYY-MM-DD)
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dayElement.dataset.date = dateString;
        dayElement.textContent = day;

        // Check if this date is already selected
        if (selectedDates.has(dateString)) {
            dayElement.classList.add('selected');
        }

        // Add click event listener to toggle selection
        dayElement.addEventListener('click', function() {
            if (selectedDates.has(dateString)) {
                selectedDates.delete(dateString);
                this.classList.remove('selected');
            } else {
                selectedDates.add(dateString);
                this.classList.add('selected');
            }
            updateSelectedDatesCount();
        });

        multiDayGrid.appendChild(dayElement);
    }

    function updateSelectedDatesCount() {
        if (selectedDatesCountElement) {
            selectedDatesCountElement.textContent = selectedDates.size;
        }
        if (selectedDatesInput) {
            selectedDatesInput.value = Array.from(selectedDates).join(',');
        }
    }

    function navigateMultiSelectorPrevMonth() {
        multiSelectorMonth--;
        if (multiSelectorMonth < 0) {
            multiSelectorMonth = 11;
            multiSelectorYear--;
        }
        renderMultiDaySelector();
    }

    function navigateMultiSelectorNextMonth() {
        multiSelectorMonth++;
        if (multiSelectorMonth > 11) {
            multiSelectorMonth = 0;
            multiSelectorYear++;
        }
        renderMultiDaySelector();
    }

    function selectAllVisibleDays() {
        const visibleDays = multiDayGrid.querySelectorAll('.mini-day:not(.other-month)');
        visibleDays.forEach(day => {
            const dateString = day.dataset.date;
            selectedDates.add(dateString);
            day.classList.add('selected');
        });
        updateSelectedDatesCount();
    }

    function clearAllSelectedDays() {
        selectedDates.clear();
        const allSelectedDays = multiDayGrid.querySelectorAll('.mini-day.selected');
        allSelectedDays.forEach(day => {
            day.classList.remove('selected');
        });
        updateSelectedDatesCount();
    }

    // Initialize multi-day selector when opening the modal
    function initMultiDaySelector() {
        // Reset to current date/selection
        multiSelectorMonth = currentDate.getMonth();
        multiSelectorYear = currentDate.getFullYear();
        selectedDates.clear();

        // Add the currently selected date
        if (selectedDate) {
            selectedDates.add(selectedDate);
        }

        renderMultiDaySelector();

        // Set up event listeners for multi-day selector navigation
        if (multiPrevMonthBtn) {
            multiPrevMonthBtn.addEventListener('click', navigateMultiSelectorPrevMonth);
        }
        if (multiNextMonthBtn) {
            multiNextMonthBtn.addEventListener('click', navigateMultiSelectorNextMonth);
        }
        if (selectAllVisibleBtn) {
            selectAllVisibleBtn.addEventListener('click', selectAllVisibleDays);
        }
        if (clearSelectionBtn) {
            clearSelectionBtn.addEventListener('click', clearAllSelectedDays);
        }
    }

    // Multi-day task modal functions
    function openMultiTaskModal() {
        if (!selectedDate) { alert('Please select a date first'); return; }
        if (!multiTaskForm) return;

        multiTaskForm.reset();
        selectedDates.clear();
        selectedDates.add(selectedDate); // Start with current selected date

        initMultiDaySelector();
        multiTaskModal.style.display = 'block';
    }

    function closeMultiTaskModal() {
        if (multiTaskModal) {
            multiTaskModal.style.display = 'none';
        }
    }

    function saveMultiTask(e) {
        e.preventDefault();
        const title = document.getElementById('multi-task-title').value;
        const startTime = document.getElementById('multi-task-time').value;
        const endTime = document.getElementById('multi-task-end-time').value;
        const description = document.getElementById('multi-task-description').value;

        if (!title) { alert('Title required'); return; }
        if (startTime && endTime && startTime >= endTime) { alert('End time must be after start time'); return; }
        if (selectedDates.size === 0) { alert('Please select at least one date'); return; }

        // Get all selected dates
        const dates = Array.from(selectedDates);

        // Create tasks for each date
        let createdCount = 0;
        let errors = 0;

        const createNextTask = (index) => {
            if (index >= dates.length) {
                alert(`Created tasks for ${createdCount} days${errors ? ` (${errors} errors)` : ''}`);
                closeMultiTaskModal();
                // Refresh current selected date
                if (selectedDate) {
                    fetchTasks(selectedDate);
                    renderDailySchedule(selectedDate);
                    recomputeDayCount(selectedDate);
                }
                return;
            }

            const date = dates[index];
            const taskData = {
                title,
                task_date: date,
                task_time: startTime || null,
                end_time: endTime || null,
                description: description || null
            };

            if (useLocal) {
                createLocalTask(taskData);
                createdCount++;
                createNextTask(index + 1);
            } else {
                fetch('api/tasks.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(taskData)
                })
                    .then(r => {
                        if (!r.ok) throw new Error();
                        return r.json();
                    })
                    .then(() => {
                        createdCount++;
                        createNextTask(index + 1);
                    })
                    .catch(() => {
                        errors++;
                        createNextTask(index + 1);
                    });
            }
        };

        createNextTask(0);
    }

    // Open task modal for adding a new task
    function openTaskModal() {
        if (!selectedDate) { alert('Please select a date first'); return; }
        taskForm.reset();
        document.querySelector('#modal-title').textContent = 'Add Task';
        document.getElementById('task-id').value = '';
        document.getElementById('task-date').value = selectedDate;
        document.getElementById('original-task-date').value = '';
        taskModal.style.display = 'block';
    }

    // Open task modal for editing an existing task
    function openEditTaskModal(taskId) {
        if (useLocal) {
            const task = getLocalTask(taskId);
            if(!task){ alert('Task not found'); return; }
            document.querySelector('#modal-title').textContent = 'Edit Task';
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-date').value = task.task_date;
            document.getElementById('original-task-date').value = task.task_date; // track old date
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-time').value = task.task_time || '';
            document.getElementById('task-end-time').value = task.end_time || '';
            document.getElementById('task-description').value = task.description || '';
            taskModal.style.display = 'block';
            return;
        }
        fetch(`api/tasks.php?id=${taskId}`)
            .then(response => { if (!response.ok) throw new Error(); return response.json(); })
            .then(task => {
                document.querySelector('#modal-title').textContent = 'Edit Task';
                document.getElementById('task-id').value = task.id;
                document.getElementById('task-date').value = task.task_date;
                document.getElementById('original-task-date').value = task.task_date;
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-time').value = task.task_time || '';
                document.getElementById('task-end-time').value = task.end_time || '';
                document.getElementById('task-description').value = task.description || '';
                taskModal.style.display = 'block';
            })
            .catch(() => alert('Error loading task details.'));
    }

    // Close task modal
    function closeTaskModal() {
        taskModal.style.display = 'none';
    }

    // Save task (create new or update existing)
    function saveTask(e) {
        e.preventDefault();
        const taskId = document.getElementById('task-id').value;
        const date = document.getElementById('task-date').value;
        const originalDate = document.getElementById('original-task-date').value;
        const title = document.getElementById('task-title').value;
        const startTime = document.getElementById('task-time').value;
        const endTime = document.getElementById('task-end-time').value;
        const description = document.getElementById('task-description').value;
        if (!title) { alert('Title required'); return; }
        if (startTime && endTime && startTime >= endTime) { alert('End time must be after start time'); return; }
        const taskData = { id: taskId || null, title, task_date: date, task_time: startTime || null, end_time: endTime || null, description: description || null };
        const isEdit = !!taskId;
        const finalize = () => {
            fetchTasks(date).then(tasks => {
                renderDailySchedule(date);
                if (isEdit && originalDate && originalDate !== date) recomputeDayCount(originalDate);
                // Direct badge update with fetched tasks length
                updateDayBadge(date, tasks.length);
            });
            closeTaskModal();
        };
        if (useLocal) {
            if (isEdit) updateLocalTask({ id: taskId, ...taskData }); else createLocalTask(taskData);
            finalize();
            return;
        }
        const method = isEdit ? 'PUT' : 'POST';
        fetch('api/tasks.php', {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData)
        })
            .then(r => { if(!r.ok) throw new Error(); return r.json(); })
            .then(() => finalize())
            .catch(() => {
                // Fallback to local mode on error
                useLocal = true; updateModeBadge();
                if (isEdit) updateLocalTask({ id: taskId, ...taskData }); else createLocalTask(taskData);
                finalize();
                alert('Server unavailable – saved locally.');
            });
    }

    // Delete task from server
    function deleteTaskFromServer(taskId) {
        // Validate taskId is provided and is not falsy
        if (!taskId) {
            console.error('Task ID is missing for delete operation');
            alert('Error: Cannot delete task with missing ID');
            return;
        }

        const targetDate = selectedDate;
        console.log('Attempting to delete task with ID:', taskId, 'Type:', typeof taskId);

        const after = (removedDate) => {
            fetchTasks(targetDate).then(tasks => {
                renderDailySchedule(targetDate);
                updateDayBadge(targetDate, tasks.length);
                recomputeDayCount(removedDate || targetDate);
            });
        };

        if (useLocal) {
            const t = getLocalTask(taskId);
            deleteLocalTask(taskId);
            after(t ? t.task_date : targetDate);
            return;
        }

        // Create a proper payload with the ID explicitly as number if possible
        let taskIdValue = taskId;
        if (typeof taskId === 'string') {
            taskIdValue = parseInt(taskId, 10);
            // If parsing failed, revert to original string value
            if (isNaN(taskIdValue)) {
                taskIdValue = taskId;
            }
        }

        const payload = { id: taskIdValue };
        console.log('Sending delete request with payload:', payload);

        fetch('api/tasks.php', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })
            .then(r => {
                if(!r.ok) {
                    console.error('Server returned error status:', r.status);
                    throw new Error('Server error: ' + r.status);
                }
                return r.json();
            })
            .then(result => {
                console.log('Delete successful:', result);
                after(targetDate);
            })
            .catch(err => {
                console.error('Failed to delete task:', err);
                alert('Error deleting task. Please try again.');
            });
    }
});

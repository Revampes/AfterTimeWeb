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
    const addTaskBtn = document.getElementById('add-task');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelButton = document.getElementById('cancel-button');
    const taskForm = document.getElementById('task-form');
    const dailyScheduleContainer = document.getElementById('daily-schedule-container');
    const dailySchedule = document.getElementById('daily-schedule');

    // Current date tracking
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;

    // Initialize calendar and event listeners
    initCalendar();

    // Initialize calendar and render current month
    function initCalendar() {
        renderCalendar(currentMonth, currentYear);
        setupEventListeners();
        initDailySchedule();
    }

    // Set up all event listeners
    function setupEventListeners() {
        prevMonthBtn.addEventListener('click', previousMonth);
        nextMonthBtn.addEventListener('click', nextMonth);
        addTaskBtn.addEventListener('click', openTaskModal);
        closeModal.addEventListener('click', closeTaskModal);
        cancelButton.addEventListener('click', closeTaskModal);
        taskForm.addEventListener('submit', saveTask);

        // Close modal when clicking outside content
        window.addEventListener('click', function(event) {
            if (event.target === taskModal) {
                closeTaskModal();
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
        addTaskBtn.disabled = false;

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
        // Clear any existing events
        const existingEvents = dailySchedule.querySelectorAll('.scheduled-event');
        existingEvents.forEach(event => event.remove());

        // Get tasks for this date and place them in schedule
        fetch(`api/tasks.php?date=${dateString}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(tasks => {
                placeTasks(tasks);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                // Will be handled by the tasks fetch
            });
    }

    // Place tasks on the daily schedule
    function placeTasks(tasks) {
        if (!tasks || tasks.length === 0) return;

        tasks.forEach(task => {
            // Skip tasks without time
            if (!task.task_time) return;

            // Get start and end times
            const startTime = task.task_time;
            const endTime = task.end_time || addHourToTime(startTime); // Default to 1 hour if no end time

            // Parse hours and calculate position
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            // Calculate percentage positions for precise placement
            const startPercent = (startHour + startMinute / 60) / 24 * 100;
            const endPercent = (endHour + endMinute / 60) / 24 * 100;
            const durationPercent = endPercent - startPercent;

            // Create event element
            const eventEl = document.createElement('div');
            eventEl.className = 'scheduled-event';
            eventEl.dataset.id = task.id;
            eventEl.style.top = `${startPercent}%`;
            eventEl.style.height = `${durationPercent}%`;

            // Add event content
            const titleEl = document.createElement('div');
            titleEl.className = 'scheduled-event-title';
            titleEl.textContent = task.title;

            const timeEl = document.createElement('div');
            timeEl.className = 'scheduled-event-time';
            timeEl.textContent = formatTimeRange(startTime, endTime);

            eventEl.appendChild(titleEl);
            eventEl.appendChild(timeEl);

            // Add click handler to edit
            eventEl.addEventListener('click', () => {
                openEditTaskModal(task.id);
            });

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

    // Fetch tasks for a specific date
    function fetchTasks(date) {
        // Show loading state
        tasksContainer.innerHTML = '<p class="loading">Loading tasks...</p>';

        // Make API request to get tasks
        fetch(`api/tasks.php?date=${date}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(tasks => {
                displayTasks(tasks);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                // Show empty state
                tasksContainer.innerHTML = '<p class="no-tasks-message">No tasks for this date</p>';
            });
    }

    // Display tasks in the tasks panel
    function displayTasks(tasks) {
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
                    <div class="task-actions">
                        <button class="task-action-btn edit-btn" onclick="editTask('${task.id}')">Edit</button>
                        <button class="task-action-btn delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
            `;
        });

        tasksContainer.innerHTML = tasksHTML;

        // Add global functions for edit/delete buttons
        window.editTask = function(taskId) {
            openEditTaskModal(taskId);
        };

        window.deleteTask = function(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTaskFromServer(taskId);
            }
        };
    }

    // Format time for display (12-hour format)
    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const h = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    // Open task modal for adding a new task
    function openTaskModal() {
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }

        // Reset form
        taskForm.reset();
        document.querySelector('#modal-title').textContent = 'Add Task';
        document.getElementById('task-id').value = '';
        document.getElementById('task-date').value = selectedDate;

        // Show modal
        taskModal.style.display = 'block';
    }

    // Open task modal for editing an existing task
    function openEditTaskModal(taskId) {
        // Make API request to get task details
        fetch(`api/tasks.php?id=${taskId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(task => {
                // Populate form
                document.querySelector('#modal-title').textContent = 'Edit Task';
                document.getElementById('task-id').value = task.id;
                document.getElementById('task-date').value = task.task_date;
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-time').value = task.task_time || '';
                document.getElementById('task-end-time').value = task.end_time || '';
                document.getElementById('task-description').value = task.description || '';

                // Show modal
                taskModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching task details:', error);
                alert('Error loading task details. Please try again.');
            });
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
        const title = document.getElementById('task-title').value;
        const startTime = document.getElementById('task-time').value;
        const endTime = document.getElementById('task-end-time').value;
        const description = document.getElementById('task-description').value;

        // Validate time range if both are provided
        if (startTime && endTime && startTime >= endTime) {
            alert('End time must be after start time');
            return;
        }

        // Prepare task data
        const taskData = {
            id: taskId || null,
            title: title,
            task_date: date,
            task_time: startTime || null,
            end_time: endTime || null,
            description: description || null
        };

        // Determine if this is a create or update
        const method = taskId ? 'PUT' : 'POST';
        const url = 'api/tasks.php';

        // Send request to server
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Refresh tasks display
            fetchTasks(date);
            renderDailySchedule(date);

            // Close modal
            closeTaskModal();
        })
        .catch(error => {
            console.error('Error saving task:', error);
            alert('Error saving task. Please try again.');
        });
    }

    // Delete task from server
    function deleteTaskFromServer(taskId) {
        // Send delete request
        fetch('api/tasks.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: taskId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Refresh tasks display
            fetchTasks(selectedDate);
            renderDailySchedule(selectedDate);
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            alert('Error deleting task. Please try again.');
        });
    }
});

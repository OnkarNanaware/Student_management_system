let tasks = [];
let currentFilter = 'All';
let searchQuery = '';

// DOM Targets
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskPriorityInput = document.getElementById('task-priority');
const taskDueDateInput = document.getElementById('task-due-date');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const navItems = document.querySelectorAll('.nav-menu li');
const viewTitle = document.getElementById('view-title');

const statPending = document.getElementById('stat-pending');
const statCompleted = document.getElementById('stat-completed');
// Analytics DOM Targets
const analyticsTotal = document.getElementById('analytics-total');
const analyticsPending = document.getElementById('analytics-pending');
const analyticsCompleted = document.getElementById('analytics-completed');
const analyticsHigh = document.getElementById('analytics-high');
const completionPercent = document.getElementById('completion-percent');
const progressBar = document.getElementById('progress-bar');

// Views DOM Targets
const tasksView = document.getElementById('tasks-view');
const timerView = document.getElementById('timer-view');

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    render();

    taskForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
    });

    // Navigation item filtering
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.dataset.view;
            if (view === 'timer') {
                tasksView.style.display = 'none';
                timerView.style.display = 'block';
            } else {
                tasksView.style.display = 'block';
                timerView.style.display = 'none';
                
                currentFilter = item.dataset.filter;
                viewTitle.textContent = `${currentFilter} Tasks`;
                render();
            }
        });
    });
});

function updateAnalytics() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;


    const pending = total - completed;


    const highPriority = tasks.filter(
        task => task.priority === "High"
    ).length;


    const percentage = total === 0 
        ? 0 
        : Math.round((completed / total) * 100);


    analyticsTotal.textContent = total;

    analyticsPending.textContent = pending;

    analyticsCompleted.textContent = completed;

    analyticsHigh.textContent = highPriority;


    completionPercent.textContent = percentage + "%";

    progressBar.style.width = percentage + "%";
}

function loadTasks() {
    const stored = localStorage.getItem('student_tasks_dashboard');
    tasks = stored ? JSON.parse(stored) : [];
}

function saveTasks() {
    localStorage.setItem('student_tasks_dashboard', JSON.stringify(tasks));
}

function updateStats() {
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    statPending.textContent = pending;
    statCompleted.textContent = completed;
}

function render() {
    updateStats();
    updateAnalytics();
    taskList.innerHTML = '';

    const filtered = tasks.filter(task => {
        const matchesFilter = 
            currentFilter === 'All' ? true :
            currentFilter === 'Completed' ? task.completed :
            !task.completed;

        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${escapeHTML(task.title)}</div>
                    <div class="task-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${task.dueDate}</span>
                        <span><i class="fa-solid fa-flag"></i> ${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-success" onclick="toggleComplete('${task.id}')">
                        <i class="fa-solid ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="editTask('${task.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteTask('${task.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = taskIdInput.value;
    const title = taskTitleInput.value.trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;

    if (!title || !dueDate) return;

    if (id) {
        tasks = tasks.map(t => t.id === id ? { ...t, title, priority, dueDate } : t);
    } else {
        tasks.push({
            id: Date.now().toString(),
            title,
            priority,
            dueDate,
            completed: false
        });
    }

    saveTasks();
    render();
    resetForm();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskPriorityInput.value = task.priority;
    taskDueDateInput.value = task.dueDate;

    formTitle.textContent = 'Edit Task';
    submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
    cancelBtn.style.display = 'inline-flex';
}

function toggleComplete(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    render();
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        render();
    }
}

function resetForm() {
    taskIdInput.value = '';
    taskForm.reset();
    formTitle.textContent = 'Create New Task';
    submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
    cancelBtn.style.display = 'none';
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}

// ==========================================
// Fail-safe Chatbot Logic
// ==========================================

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
    }
}

function closeChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.add('hidden');
    }
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function handleChipClick(text) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.value = text;
        sendChatMessage();
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const text = chatInput ? chatInput.value.trim() : '';
    if (!text) return;

    appendMessage(text, 'user-message');
    chatInput.value = '';

    setTimeout(() => {
        const botReply = getBotResponse(text);
        appendMessage(botReply, 'bot-message');
    }, 400);
}

function appendMessage(text, className) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('pending') || q.includes('due') || q.includes('how many tasks')) {
        const pendingList = tasks.filter(t => !t.completed);
        if (pendingList.length === 0) {
            return "🎉 You have no pending tasks! Great job staying on top of your work.";
        }
        const taskTitles = pendingList.map(t => `• <b>${escapeHTML(t.title)}</b> (Due: ${t.dueDate})`).join('<br>');
        return `You have <b>${pendingList.length}</b> pending task(s):<br>${taskTitles}`;
    }

    if (q.includes('completed') || q.includes('done')) {
        const completedCount = tasks.filter(t => t.completed).length;
        return `You have completed <b>${completedCount}</b> task(s) so far. Keep it up!`;
    }

    if (q.includes('high priority') || q.includes('urgent')) {
        const highPriority = tasks.filter(t => !t.completed && t.priority === 'High');
        if (highPriority.length === 0) return "You don't have any high-priority tasks pending!";
        const titles = highPriority.map(t => `• ${escapeHTML(t.title)}`).join('<br>');
        return `⚠️ <b>High Priority Tasks:</b><br>${titles}`;
    }

    if (q.includes('add') || q.includes('create') || q.includes('new task')) {
        return "To add a task, fill out the <b>Task Title</b> and <b>Due Date</b> in the form at the top and click <b>Add Task</b>.";
    }

    if (q.includes('edit') || q.includes('change')) {
        return "Click the yellow <b>Pencil icon</b> on any task card to edit its details.";
    }

    if (q.includes('delete') || q.includes('remove')) {
        return "Click the red <b>Trash icon</b> next to a task to delete it permanently.";
    }

    if (q.includes('tip') || q.includes('study') || q.includes('productivity')) {
        const tips = [
            "💡 <b>Pomodoro Technique:</b> Work for 25 minutes, then take a 5-minute break.",
            "💡 <b>Eat the Frog:</b> Tackle your highest-priority tasks first thing in the morning.",
            "💡 <b>Time Blocking:</b> Assign specific time slots on your calendar for each task."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hello! How can I assist you with your workload today?";
    }

    return "I'm not sure about that. Try asking:<br>• <i>What are my pending tasks?</i><br>• <i>Show high priority tasks</i><br>• <i>Give me a study tip</i>";
}

// ==========================================
// Focus Timer Logic
// ==========================================

let timerInterval;
let timerTimeLeft = 25 * 60;
let isTimerRunning = false;
let currentTimerMode = 25; // in minutes

const timerDisplay = document.getElementById('timer-display');
const timerStartBtn = document.getElementById('timer-start');
const timerPauseBtn = document.getElementById('timer-pause');
const timerResetBtn = document.getElementById('timer-reset');
const timerModeBtns = document.querySelectorAll('.timer-mode-btn');

function updateTimerDisplay() {
    const minutes = Math.floor(timerTimeLeft / 60);
    const seconds = timerTimeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

if (timerStartBtn) {
    timerStartBtn.addEventListener('click', () => {
        if (!isTimerRunning) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if (timerTimeLeft > 0) {
                    timerTimeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    alert("Time's up!");
                }
            }, 1000);
        }
    });

    timerPauseBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
    });

    timerResetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerTimeLeft = currentTimerMode * 60;
        updateTimerDisplay();
    });

    timerModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timerModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentTimerMode = parseInt(btn.dataset.time);
            timerTimeLeft = currentTimerMode * 60;
            updateTimerDisplay();
            
            clearInterval(timerInterval);
            isTimerRunning = false;
        });
    });
}

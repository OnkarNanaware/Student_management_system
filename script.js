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
            
            currentFilter = item.dataset.filter;
            viewTitle.textContent = `${currentFilter} Tasks`;
            render();
        });
    });
});

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
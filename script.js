// State variables
let tasks = [];
let currentFilter = 'All';
let searchQuery = '';

// DOM Elements
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
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();

    // Event Listeners
    taskForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', handleSearch);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
});

// Load tasks from Local Storage
function loadTasks() {
    const stored = localStorage.getItem('student_tasks');
    tasks = stored ? JSON.parse(stored) : [];
}

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('student_tasks', JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = 
            currentFilter === 'All' ? true :
            currentFilter === 'Completed' ? task.completed :
            !task.completed;

        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${escapeHTML(task.title)}</div>
                    <div class="task-meta">
                        <span>Due: ${task.dueDate}</span>
                        <span class="priority-badge">Priority: ${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-success" onclick="toggleComplete('${task.id}')">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-secondary" onclick="editTask('${task.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
}

// Handle Form Submission (Add or Edit)
function handleFormSubmit(e) {
    e.preventDefault();

    const id = taskIdInput.value;
    const title = taskTitleInput.value.trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;

    if (!title || !dueDate) return;

    if (id) {
        // Edit existing task
        tasks = tasks.map(task => 
            task.id === id ? { ...task, title, priority, dueDate } : task
        );
    } else {
        // Add new task
        const newTask = {
            id: Date.now().toString(),
            title,
            priority,
            dueDate,
            completed: false
        };
        tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    resetForm();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskPriorityInput.value = task.priority;
    taskDueDateInput.value = task.dueDate;

    formTitle.textContent = 'Edit Task';
    submitBtn.textContent = 'Save Changes';
    cancelBtn.style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Completion
function toggleComplete(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Reset Form State
function resetForm() {
    taskIdInput.value = '';
    taskForm.reset();
    formTitle.textContent = 'Add New Task';
    submitBtn.textContent = 'Add Task';
    cancelBtn.style.display = 'none';
}

// Search Handler
function handleSearch(e) {
    searchQuery = e.target.value;
    renderTasks();
}

// Security Helper to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
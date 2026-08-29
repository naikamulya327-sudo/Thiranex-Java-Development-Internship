let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filters = document.querySelector(".filters");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        li.innerHTML = `
            <input type="checkbox" class="complete-btn" ${task.completed ? "checked" : ""}>
            <span class="${task.completed ? "completed" : ""}">${task.text}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

taskList.addEventListener("click", function(event) {
    const li = event.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    const task = tasks.find(task => task.id === id);

    if (event.target.classList.contains("complete-btn")) {
        task.completed = event.target.checked;
        saveTasks();
        renderTasks();
    }

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    if (event.target.classList.contains("edit-btn")) {
        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
});

filters.addEventListener("click", function(event) {
    if (!event.target.classList.contains("filter")) return;

    currentFilter = event.target.dataset.filter;

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("active");
    });

    event.target.classList.add("active");

    renderTasks();
});

renderTasks();
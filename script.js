// script.js

document.getElementById('add-task').addEventListener('click', function() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        addTask(taskText);
        taskInput.value = '';
        updateProgress();
    }
});

document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('add-task').click();
    }
});

function addTask(taskText) {
    const todoList = document.getElementById('todo-list');

    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.draggable = true;

    const serialNumber = document.createElement('span');
    serialNumber.className = 'serial-number';
    serialNumber.textContent = todoList.children.length + 1;
    todoItem.appendChild(serialNumber);

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    todoItem.appendChild(taskSpan);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'todo-buttons';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.addEventListener('click', () => editTask(todoItem, taskSpan));
    buttonsDiv.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', () => deleteTask(todoItem));
    buttonsDiv.appendChild(deleteButton);

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.className = 'complete';
    completeButton.addEventListener('click', () => markAsComplete(todoItem));
    buttonsDiv.appendChild(completeButton);

    const partialButton = document.createElement('button');
    partialButton.textContent = 'Partial';
    partialButton.className = 'partial';
    partialButton.addEventListener('click', () => markAsPartial(todoItem));
    buttonsDiv.appendChild(partialButton);

    const notCompleteButton = document.createElement('button');
    notCompleteButton.textContent = 'Not Complete';
    notCompleteButton.className = 'not-complete';
    notCompleteButton.addEventListener('click', () => markAsNotComplete(todoItem));
    buttonsDiv.appendChild(notCompleteButton);

    todoItem.appendChild(buttonsDiv);
    todoList.appendChild(todoItem);

    todoItem.addEventListener('dragstart', () => {
        todoItem.classList.add('dragging');
    });

    todoItem.addEventListener('dragend', () => {
        todoItem.classList.remove('dragging');
        updateSerialNumbers();
    });

    todoList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(todoList, e.clientY);
        const draggingElement = document.querySelector('.dragging');
        if (afterElement == null) {
            todoList.appendChild(draggingElement);
        } else {
            todoList.insertBefore(draggingElement, afterElement);
        }
    });
}

function editTask(todoItem, taskSpan) {
    const newTaskText = prompt('Edit your task', taskSpan.textContent);
    if (newTaskText !== null) {
        taskSpan.textContent = newTaskText.trim();
    }
}

function deleteTask(todoItem) {
    todoItem.remove();
    updateSerialNumbers();
    updateProgress();
}

function markAsComplete(todoItem) {
    todoItem.classList.remove('partially-completed', 'not-completed');
    todoItem.classList.add('completed');
    updateProgress();
}

function markAsPartial(todoItem) {
    todoItem.classList.remove('completed', 'not-completed');
    todoItem.classList.add('partially-completed');
    updateProgress();
}

function markAsNotComplete(todoItem) {
    todoItem.classList.remove('completed', 'partially-completed');
    todoItem.classList.add('not-completed');
    updateProgress();
}

function updateSerialNumbers() {
    const todoList = document.getElementById('todo-list');
    Array.from(todoList.children).forEach((todoItem, index) => {
        todoItem.querySelector('.serial-number').textContent = index + 1;
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateProgress() {
    const todoList = document.getElementById('todo-list');
    const totalTasks = todoList.children.length;
    let completedTasks = 0;
    let partiallyCompletedTasks = 0;

    Array.from(todoList.children).forEach(todoItem => {
        if (todoItem.classList.contains('completed')) {
            completedTasks++;
        } else if (todoItem.classList.contains('partially-completed')) {
            partiallyCompletedTasks++;
        }
    });

    const progressBar = document.getElementById('progress-bar');
    if (totalTasks === 0) {
        progressBar.style.width = '0%';
    } else {
        const progress = ((completedTasks + partiallyCompletedTasks * 0.5) / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

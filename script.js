document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const deleteAllBtn = document.getElementById("deleteAllBtn");
  const taskCount = document.getElementById("taskCount");

  loadTasks();

  function addTask() {
    if (taskInput.value.trim() !== "") {
      const taskItem = createTaskItem(taskInput.value, false); // Create a new task item
      taskList.appendChild(taskItem);
      taskInput.value = ""; // Clear input field
      updateTaskCount(); // Update count when a task is added
      saveTasks(); // Save to localStorage
    }
  }

  function createTaskItem(taskValue, isDone) {
    const taskItem = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = taskValue;
    if (isDone) {
      taskText.classList.add("done");
    }

    const markDone = document.createElement("span");
    markDone.classList.add("mark-done");
    markDone.textContent = isDone ? "✅" : "⚪";

    markDone.addEventListener("click", () => {
      if (markDone.textContent === "⚪") {
        markDone.textContent = "✅";
        taskText.classList.add("done");
        taskList.appendChild(taskItem);
      } else {
        markDone.textContent = "⚪";
        taskText.classList.remove("done");
        taskList.insertBefore(taskItem, taskList.lastChild);
      }
      saveTasks(); // Save to localStorage
    });

    taskText.addEventListener("click", () => {
      if (!isDone) {
        const editInput = document.createElement("input");
        editInput.value = taskText.textContent;
        editInput.classList.add("edit-input");
        taskItem.replaceChild(editInput, taskText);
        editInput.focus();

        editInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            saveEdit(editInput.value, taskItem, editInput);
          }
        });

        editInput.addEventListener("blur", () => {
          saveEdit(editInput.value, taskItem, editInput);
        });
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-task");
    deleteBtn.addEventListener("click", () => {
      taskList.removeChild(taskItem);
      updateTaskCount(); // Update count when a task is deleted
      saveTasks(); // Save to localStorage
    });

    taskItem.appendChild(markDone);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    return taskItem;
  }

  function saveEdit(newValue, taskItem, editInput) {
    const taskText = document.createElement("span");
    taskText.textContent = newValue;
    taskText.addEventListener("click", () => {
      if (!taskText.classList.contains("done")) {
        const editInput = document.createElement("input");
        editInput.value = taskText.textContent;
        editInput.classList.add("edit-input");
        taskItem.replaceChild(editInput, taskText);
        editInput.focus();

        editInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            saveEdit(editInput.value, taskItem, editInput);
          }
        });

        editInput.addEventListener("blur", () => {
          saveEdit(editInput.value, taskItem, editInput);
        });
      }
    });

    taskItem.replaceChild(taskText, editInput);
    saveTasks();
  }

  function updateTaskCount() {
    const taskItems = document.querySelectorAll("#taskList li");
    taskCount.textContent = `${taskItems.length} items total`;
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((taskItem) => {
      const taskText = taskItem.querySelector("span:nth-child(2)").textContent;
      const isDone = taskItem.querySelector(".mark-done").textContent === "✅";
      tasks.push({ text: taskText, done: isDone });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const taskItem = createTaskItem(task.text, task.done);
      taskList.appendChild(taskItem);
    });
    updateTaskCount();
  }

  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  deleteAllBtn.addEventListener("click", () => {
    taskList.innerHTML = "";
    updateTaskCount();
    localStorage.removeItem("tasks"); // Clear localStorage
  });
});

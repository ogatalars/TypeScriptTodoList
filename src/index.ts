import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createAt: Date;
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.getElementById("new-task-title") as HTMLInputElement | null
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", (event) => {
  event.preventDefault()
  if(input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createAt: new Date()
  }
  tasks.push(newTask)
  saveTasks()
  
  addListItem(newTask)
  input.value = ""
})

function removeListItem(task: Task) {
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
    const item = list?.querySelector(`[data-id="${task.id}"]`);
    item?.remove();
  }
}

function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const removeButton = document.createElement("button"); // Add remove button
  removeButton.textContent = "Remove"; // Set the button text
  removeButton.addEventListener("click", () => removeListItem(task)); // Add event listener
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label, removeButton); // Append the remove button
  item.dataset.id = task.id; // Set the task ID as a data attribute
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}

import { Task, DataProps } from "./model/task"

const rootElement = document.querySelector('.root')!

function createTaskTemplate(task: DataProps): string {
    // Determines if the checkbox should be checked based on the status
    const isChecked = task.status === 1 ? 'checked' : '';
    const escapedTask = escapeHtml(task.task);

    return `
        <li class="list-item">
            <input type="checkbox" id="item${task.id}" ${isChecked} data-id="${task.id}">
            <label for="item${task.id}">${escapedTask}</label>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
            <button class="edit-btn" data-id="${task.id}" >Edit</button>
        </li>
    `;

    function escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

function renderTemplates(templates:string[], parent:Element):void{
    const templateElement = document.createElement('template')

    for (const t of templates) {
        templateElement.innerHTML += t
    }

    parent.append(templateElement.content)
}

document.addEventListener('DOMContentLoaded', async () => {
    const tasks: DataProps[] = await Task.loadAll();
    
    const taskTemplates = tasks.map(createTaskTemplate);
    renderTemplates(taskTemplates, rootElement);
    
    tasks.forEach(task => {
        const checkbox = document.getElementById(`item${task.id}`);
        
        if (checkbox) {
            checkbox.addEventListener('change', async (event: Event) => {
                const isChecked = (event.target as HTMLInputElement).checked;
                const response = await Task.toggleStatus(+task.id);

                if (!response.ok) {
                    console.error('Failed to update task status', response);
                }
            });
        }
        const deleteButton = document.querySelector(`.delete-btn[data-id="${task.id}"]`);
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                const response = await Task.delete(+task.id);
                
                if (response != null) {
                    console.log(`Task ${task.id} deleted successfully.`);
                    deleteButton.closest('.list-item')?.remove();
                } else {
                    console.error('Failed to delete task', response);
                }
            });
        }

        const editButton = document.querySelector(`.edit-btn[data-id="${task.id}"]`);
        if (editButton) {
            editButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent refresh
                const taskId = task.id;
                window.location.href = `create.html?taskId=${taskId}`; // Redirect to create.html with the task ID
            });
        }
    });
});
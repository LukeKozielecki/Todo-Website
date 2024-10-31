import { DataProps, Task } from "./model/task";

const taskInput = document.querySelector('input[name="task"]') as HTMLInputElement;
const form = document.querySelector('.create') as HTMLFormElement;

// Function to get the taskId from URL parameters
function getTaskIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('taskId');
}

// Check for taskId and populate the form if it exists
const taskId = getTaskIdFromUrl();
if (taskId) {
    loadTask(taskId);
}

async function loadTask(id: string) {
    const response = await fetch(`http://localhost:3000/task/${id}`);
    if (response.ok) {
        const task: DataProps = await response.json();
        taskInput.value = task.task;
    } else {
        console.error('Failed to load task:', response);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = new FormData(form);
    const taskData: DataProps = {
        task: data.get('task') as string,
        status: 0,
        // Use taskId if editing, else generate a new one
        id: taskId ? taskId : await generateTaskId()
    };

    let res: Response;
    if (taskId) {
        //PUT call for update old
        res = await Task.update(taskData);
    } else {
        //POST call for save new
        res = await Task.save(taskData);
    }

    if (!res.ok) {
        console.log('Not able to save task');
    } else {
        window.location.href = '/';
    }
});

async function generateTaskId(): Promise<string> {
    const tasks = await Task.loadAll();
    console.log(`There are ${tasks.length} tasks.`);
    
    const randomId = Math.floor(Math.random() * 1000).toString();
    const existingIds = tasks.map(task => task.id);
    
    if (existingIds.includes(randomId)) {
        console.log(`The random ID ${randomId} already exists.`);
        return await generateTaskId(); // Regenerate ID if it already exists
    } else {
        console.log(`The random ID ${randomId} is unique.`);
        return randomId;
    }
}
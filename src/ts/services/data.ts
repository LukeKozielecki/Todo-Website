import { DataProps } from "../model/task";
export class TaskClass <T> {
    constructor(private endpoint:string){}
    async loadAll(): Promise<T[]> {
        try {
            const res = await fetch(this.endpoint);
            return await res.json();
        } catch (error) {
            console.error("Failed to load data:", error);
            throw error;
        }
    }
    async delete(id: number): Promise<T> {
        try {
            const res = await fetch(`${this.endpoint}/${id}`, {
                method: 'DELETE',
            });    
            return await res.json();
        } catch (error) {
            console.error(`Failed to delete item with id ${id}:`, error);
            throw error;
        }
    }
    async toggleStatus(id: number): Promise<Response> {
        try {
            const currentTaskResponse = await fetch(`${this.endpoint}/${id}`);
            
            if (!currentTaskResponse.ok) {
                throw new Error(`Error fetching task: ${currentTaskResponse.status}`);
            }

            const currentTask = await currentTaskResponse.json();
            
            const updatedTask = {
                task: currentTask.task,
                status: currentTask.status === 1 ? 0 : 1,
                id: currentTask.id
            };

            const res = await fetch(`${this.endpoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedTask),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                throw new Error(`Error updating task: ${res.status}`);
            }

            return res;
        } catch (error) {
            console.error('Error toggling task status:', error);
            throw error; 
        }
    }
    async update(data: DataProps): Promise<Response> {
        try {
            const res = await fetch(`${this.endpoint}/${data.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            
            // Check if the response is successful
            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }
            
            return res;
        } catch (error) {
            console.error("Update failed:", error);
            throw error;
        }
    }
    async save(data: T) {
        try {
            const res = await fetch(`${this.endpoint}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }
    
            return res;
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    }
}
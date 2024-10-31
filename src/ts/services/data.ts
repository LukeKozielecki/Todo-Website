import { DataProps } from "../model/task";
export class TaskClass <T> {
    constructor(private endpoint:string){}
    async loadAll(): Promise<T[]>{
        const res = await fetch(this.endpoint)
        return res.json()
    }
    async delete(id:number):Promise<T>{
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE', // Ensure this is a DELETE request
        });
        return res.json();
    }
    async toggleStatus(id: number): Promise<Response> {
        const currentTaskResponse = await fetch(`${this.endpoint}/${id}`);
        const currentTask = await currentTaskResponse.json();
        const updatedTask = {
            task: currentTask.task,
            status: currentTask.status === 1 ? 0 : 1,
            id: currentTask.id
        };
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTask), // Send just the updated task
            headers: { 'Content-Type': 'application/json' }
        });
        
        return res;
    }
    async update(data: DataProps): Promise<Response> {
        const res = await fetch(`${this.endpoint}/${data.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        return res;
    }
    async save (data: T) {
        const res = await fetch(`${this.endpoint}`, {method: 'POST', body: JSON.stringify(data), headers:{'Content-Type': 'application/json'}})
        return res
    }
}
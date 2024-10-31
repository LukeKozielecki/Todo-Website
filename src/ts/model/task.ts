import {TaskClass} from "../services/data"

export interface DataProps {
    task:string,
    status:number,
    id:string
}

export const Task = new TaskClass<DataProps>('http://localhost:3000/task')

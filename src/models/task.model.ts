import { Schema, model } from "mongoose"
import { ITask } from "../interfaces/task.interface"

const TaskSchema: Schema<ITask> = new Schema<ITask>({
    title: { type: String, required: true },
    amt: { type: Number, required: true },
    coins: { type: Number, required: true },
    type: { type: String, required: true }
});

const Task = model<ITask>('Task', TaskSchema);
export default Task;
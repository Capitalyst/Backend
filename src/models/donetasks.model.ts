import { Schema, model } from "mongoose";
import { IDoneTasks } from "../interfaces/task.interface";

const DoneTasksSchema: Schema<IDoneTasks> = new Schema<IDoneTasks>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    completedAt: { type: Date, default: Date.now }
});

const DoneTasks = model<IDoneTasks>('DoneTasks', DoneTasksSchema);
export default DoneTasks;
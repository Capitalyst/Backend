import { Document, ObjectId } from "mongoose";

export interface ITask extends Document {
    title: string;
    amt: number;
    coins: number;
    type: string;
}

export interface IDoneTasks extends Document {
    userId: ObjectId;
    taskId: ObjectId;
    completedAt: Date;
}
import { Document, ObjectId } from "mongoose";

export interface IExpense extends Document {
    userId: ObjectId;
    title: string;
    amt: number;
    category: string;
    date: Date;
}
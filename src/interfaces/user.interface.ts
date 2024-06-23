import { ObjectId, Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    role: string;
    coins: number;
    age: number;
    retirementAge: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    runningExpense: number
    savingGoal: number;
}

export interface ICompletedModule extends Document {
    userId: ObjectId;
    moduleId: ObjectId;
    completedAt: Date;
}
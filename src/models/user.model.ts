import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchama: Schema<IUser> = new Schema<IUser>({
    name: String,
    email: { type: String, required: true },
    password: String,
    role: { type: String, required: true },
    coins: { type: Number, default: 0 },
    age: Number,
    retirementAge: Number,
    monthlyIncome: Number,
    monthlyExpenses: Number,
    runningExpense: Number,
    savingGoal: Number
}, { timestamps: true });

const User = model<IUser>('User', UserSchama);
export default User;
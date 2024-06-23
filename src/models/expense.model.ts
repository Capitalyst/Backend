import { Schema, model } from "mongoose";
import { IExpense } from "../interfaces/expense.interface";

const ExpenseSchema: Schema<IExpense> = new Schema<IExpense>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amt: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: new Date() }
});

const Expense = model<IExpense>('Expense', ExpenseSchema);
export default Expense;
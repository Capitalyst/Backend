import { Request, Response, NextFunction } from "express";
import Task from "../models/task.model";
import DoneTasks from "../models/donetasks.model";
import { ITask } from "../interfaces/task.interface";
import { IUser } from "../interfaces/user.interface";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, coins, type, amt } = req.body;

        if (!title || !coins || !type) {
            return next({ status: 400, message: "title, coins, amt and type are required" });
        }

        const newTask = new Task({
            title,
            coins,
            type,
            amt
        });
        await newTask.save();

        return res.status(201).json({
            type: 'success',
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
}


export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = req.user!;
        const allTasks = await Task.find({}).lean();
        const doneTasks = await DoneTasks.find({ userId: user._id }).select('taskId').lean();
        const doneTaskIds = doneTasks.map(doneTask => doneTask.taskId.toString());
        const notDoneTasks = allTasks.filter(task => !doneTaskIds.includes(task._id.toString()));

        for (const task of notDoneTasks) {
            const isDone = await checkTaskStatus(task, user);
            if (isDone) {
                await DoneTasks.create({
                    userId: user._id,
                    taskId: task._id,
                    completedAt: new Date()
                });
                user.coins += task.coins;
            }
        }

        await user.save();

        const tasksWithStatus = allTasks.map(task => ({
            ...task,
            status: doneTaskIds.includes(task._id.toString())
        }));

        return res.status(200).json({
            type: 'success',
            message: 'Tasks retrieved',
            tasks: tasksWithStatus
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
};
const checkTaskStatus = async (task: ITask, user: IUser): Promise<boolean> => {
    try {
        if (task.type === 'income') {
            return Promise.resolve(user.monthlyIncome >= task.amt);
        } else if (task.type === 'expense') {
            return Promise.resolve(user.runningExpense < task.amt);
        } else if (task.type === 'monthlyexpense') {
            return Promise.resolve(user.monthlyExpenses < task.amt);
        } else if (task.type === 'saving') {
            return Promise.resolve(user.savingGoal >= task.amt);
        } else {
            console.error("Invalid task type:", task.type);
            return Promise.resolve(false);
        }
    } catch (error) {
        console.error("Something went wrong:", error);
        return Promise.resolve(false);
    }
};
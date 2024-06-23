import { Request, Response, NextFunction } from "express";
import admin from "../utils/firebase.util";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import { createJwtToken } from "../utils/jwt.util";
import { ObjectId } from "mongoose";
import Expense from "../models/expense.model";
import { IExpense } from "../interfaces/expense.interface";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authToken } = req.body;

        if (!authToken) {
            console.error("authToken is required");
            console.log(req.body);
            return next({ status: 400, message: "authToken is required" });
        }

        const decodedToken = await admin.auth().verifyIdToken(authToken);
        const email = decodedToken.email;

        if (!email) {
            console.error("Email isn't available");
            return res.status(400).json({ message: "No email associated with this token" });
        }

        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            // register the user
            const newUser = new User({
                email,
                role: "user",
                coins: 0
            });

            await newUser.save();
            const payload = {
                sub: newUser.id,
                role: newUser.role
            }

            const token = createJwtToken(payload);
            return res.status(200).json({
                type: "success",
                message: "Login successful",
                data: {
                    token,
                    isRegistered: newUser.name ? true : false
                }
            });
        }

        const payload = {
            sub: user.id,
            role: user.role
        };

        const token = createJwtToken(payload);
        return res.status(200).json({
            type: "success",
            message: "Login successful",
            data: {
                token,
                isRegistered: user.name ? true : false
            }
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
}


export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { name, age, retirementAge, monthlyIncome, monthlyExpenses, savingGoal } = req.body;

        if (!name || !age || !retirementAge || !monthlyIncome || !monthlyExpenses || !savingGoal) {
            return next({ status: 400, message: "All fields are required" });
        }

        user.name = name;
        user.age = age;
        user.retirementAge = retirementAge;
        user.monthlyIncome = monthlyIncome;
        user.monthlyExpenses = monthlyExpenses;
        user.savingGoal = savingGoal;

        await user.save();

        return res.status(200).json({
            type: "success",
            message: "Registration successful",
            data: user
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
}


export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;

        user.password = undefined;

        return res.status(200).json({
            type: "success",
            message: "User data retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
}


export const leaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user! as IUser;
        const users: IUser[] = await User.find({ role: 'user' }).sort({ coins: -1 }).select('name coins').lean();

        const usersWithCurrentUserFlag = users.map(u => ({
            ...u,
            currentUser: (u._id as ObjectId).toString() === (user._id as ObjectId).toString()
        }));

        return res.status(200).json({
            type: "success",
            message: "Leaderboard retrieved successfully",
            data: usersWithCurrentUserFlag
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
};


export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { title, amt, category } = req.body;
        const newExpense = new Expense({ userId: user._id, title, amt, category });
        const savedExpense = await newExpense.save();
        res.status(201).json({
            type: 'success',
            message: "expense tracked successfully",
            data: savedExpense
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
};


export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const expenses: IExpense[] = await Expense.find({ userId: user._id }).sort({ date: -1 });
        res.status(200).json({
            type: 'success',
            message: "expenses retrieved successfully",
            data: expenses
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
}


export const getExpensesByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { category } = req.query;
        const expenses: IExpense[] = await Expense.find({ userId: user._id, category }).sort({ date: -1 });

        res.status(200).json({
            type: 'success',
            message: "expenses retrieved successfully",
            data: expenses
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
}
import { Request, Response, NextFunction } from "express";
import { ILearningModule } from "../interfaces/learningmodule.interface";
import LearningModule from "../models/learningmodule.model";
import CompletedModule from "../models/completedmodule.model";
import { ICompletedModule, IUser } from "../interfaces/user.interface";
import User from "../models/user.model";


// ----------------- Learning Module -----------------
export const createLearningModule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, image, content, quiz, coins } = req.body;

        if (!title || !description || !image || !content || !Array.isArray(quiz) || quiz.length === 0) {
            return next({ status: 400, message: 'All required fields must be provided and quiz must be a non-empty array.' })
        }

        const newLearningModule = new LearningModule({
            title,
            description,
            image,
            content,
            quiz,
            coins: coins || 0
        });

        const savedLearningModule = await newLearningModule.save();
        res.status(201).json(savedLearningModule);
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
}


export const markModuleAsCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = req.user!;
        const { moduleId } = req.body;

        const module: ILearningModule | null = await LearningModule.findById(moduleId);
        if (!module) {
            return next({ status: 400, message: "Module not found" });
        }

        const existingCompletion = await CompletedModule.findOne({ userId: user._id, moduleId: module._id });
        if (existingCompletion) {
            return next({ status: 400, message: "Module already completed" });
        }

        const completedModule = new CompletedModule({
            userId: user._id,
            moduleId
        });

        const savedCompletedModule = await completedModule.save();

        const updatedUser = await User.findByIdAndUpdate(user._id, { $inc: { coins: module.coins } }, { new: true });
        if (!updatedUser) {
            throw new Error;
        }
        return res.status(201).json({
            type: 'success',
            message: 'Module marked as completed',
            data: savedCompletedModule
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
}


export const getLearningModules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = req.user!;

        const allmodules: ILearningModule[] = await LearningModule.find({});
        const completedModules: ICompletedModule[] = await CompletedModule.find({ userId: user._id }).select('moduleId');
        const completedModuleIds = new Set(completedModules.map(cm => cm.moduleId.toString()));

        const modulesWithStatus = allmodules.map(module => ({
            ...module.toObject(),
            completed: completedModuleIds.has(module._id!.toString())
        }));

        return res.status(200).json({
            type: 'success',
            message: 'Learning modules retrieved',
            data: modulesWithStatus
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
}
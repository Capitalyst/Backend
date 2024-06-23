import { Request, Response, NextFunction } from "express";
import LearningVideos from "../models/learningvideos.model";
import { ILearningVideos } from "../interfaces/learningvideos.interface";

export const createLearningVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, videoUrl } = req.body;

        if (!title || !description || !videoUrl) {
            return next({ status: 400, message: 'All required fields must be provided.' })
        }

        const newLearningVideo = new LearningVideos({
            title,
            description,
            videoUrl
        });

        const savedLearningVideo = await newLearningVideo.save();
        res.status(201).json(savedLearningVideo);
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
}


export const getLearningsVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const learningVideos: ILearningVideos[] = await LearningVideos.find({});
        return res.status(200).json({
            type: 'success',
            message: 'Learning videos retrieved',
            data: learningVideos
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
}
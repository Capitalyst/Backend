import { Document } from "mongoose";

export interface ILearningVideos extends Document {
    title: string;
    description: string;
    videoUrl: string;
}
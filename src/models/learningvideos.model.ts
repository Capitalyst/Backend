import { Schema, model } from "mongoose";
import { ILearningVideos } from "../interfaces/learningvideos.interface";

const LearningVideosSchema: Schema<ILearningVideos> = new Schema<ILearningVideos>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true }
});

const LearningVideos = model<ILearningVideos>('LearningVideos', LearningVideosSchema);
export default LearningVideos;
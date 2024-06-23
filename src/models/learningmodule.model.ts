import { model, Schema } from "mongoose";
import { ILearningModule, IQuiz } from "../interfaces/learningmodule.interface";

const QuizSchema: Schema<IQuiz> = new Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: Number, required: true },
    explain: String
}, { _id: false });

const LearningModuleSchema: Schema<ILearningModule> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    quiz: { type: [QuizSchema], required: true },
    coins: { type: Number, default: 0 }
});

const LearningModule = model<ILearningModule>('LearningModule', LearningModuleSchema);
export default LearningModule;
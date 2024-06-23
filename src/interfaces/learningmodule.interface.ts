import { Document } from "mongoose";

export interface IQuiz {
    question: string;
    options: [string];
    answer: number; // index of option
    explain?: string;
}

export interface ILearningModule extends Document {
    title: string;
    description: string;
    image: string;
    content: string;
    quiz: [IQuiz];
    coins: number;
}
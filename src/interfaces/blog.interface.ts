import { Document, ObjectId } from "mongoose";

export interface IBlog extends Document {
    title: string;
    description: string;
    image: string;
    content: string;
    author: ObjectId;
    likes: Array<ObjectId>;
}
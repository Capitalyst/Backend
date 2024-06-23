import { Schema, model } from "mongoose";
import { IBlog } from "../interfaces/blog.interface";


const BlogSchema: Schema<IBlog> = new Schema<IBlog>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Blog = model<IBlog>('Blog', BlogSchema);
export default Blog;
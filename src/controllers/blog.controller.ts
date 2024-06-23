import { Request, Response, NextFunction } from 'express';
import Blog from '../models/blog.model';

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { title, description, image, content } = req.body;

        const newBlog = new Blog({ title, description, image, content, user });
        await newBlog.save();

        return res.status(201).json({
            type: 'success',
            message: 'Blog created successfully',
            data: newBlog
        });
    } catch (error) {
        console.error("Something went wrong, error:", error);
        next(error);
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { id } = req.params;

        const deletedBlog = await Blog.findOneAndDelete({ _id: id, author: user._id });
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            type: 'success',
            message: 'Blog deleted successfully',
            data: deletedBlog
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
};


export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id).populate('author', 'name').populate('likes', 'name');
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            type: 'success',
            message: 'Blog retrieved successfully',
            data: blog
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
};


export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await Blog.find().populate('author', 'name').populate('likes', 'name');
        res.status(200).json({
            type: 'success',
            message: 'Blogs retrieved successfully',
            data: blogs
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        next(error);
    }
};

// Toggle like on a blog
// export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const userId = req.body.userId;

//         const blog = await Blog.findById(id);
//         if (!blog) {
//             return res.status(404).json({ message: "Blog not found" });
//         }

//         const isLiked = blog.likes.includes(userId);
//         if (isLiked) {
//             blog.likes = blog.likes.filter(like => like.toString() !== userId);
//         } else {
//             blog.likes.push(new mongoose.Types.ObjectId(userId));
//         }

//         await blog.save();
//         res.status(200).json(blog);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
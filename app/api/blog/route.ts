import Blog from "@/models/blog"
import { connectDB } from "@/utils/database"

export const GET = async (req: Request, res: Response) => {
    try {
        await connectDB()
        const blogs = await Blog.find().populate('author').sort({ updatedAt: -1 })
        return new Response(JSON.stringify(blogs), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to fetch all blogs", { status: 500 })
    }
}
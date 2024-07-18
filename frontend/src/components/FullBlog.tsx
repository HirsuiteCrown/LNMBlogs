import { useNavigate } from "react-router-dom";
import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const createdAtString = blog.createdAt; 
    const utcDate = new Date(createdAtString); 
    const istDate = utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    const navigate = useNavigate();
    const handleAuthorClick = ()=>{
        navigate(`/profile/${blog.authorId}`)
    }
    return (  
        <div className="bg-gray-100 min-h-screen">
            <Appbar />
            <div className="flex justify-center py-12">
                <div className="grid grid-cols-12 gap-8 w-full max-w-screen-xl px-6 md:px-12">
                    <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg shadow-md">
                        <div className="text-5xl font-extrabold text-gray-800 mb-4">
                            {blog.title}
                        </div>
                        <div className="text-gray-500 mb-6">
                            Posted on {istDate || "..."}
                        </div>
                        <div className="text-gray-700 leading-relaxed">
                            {blog.content}
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg shadow-md">
                        <div className="text-gray-600 text-lg mb-4">
                            Author
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={handleAuthorClick}>
                            <div className="mr-4" >
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-800">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="text-gray-500 text-sm mt-2">
                                    {blog.author.about || "No information available."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

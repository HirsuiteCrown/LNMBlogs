import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(blogs);
    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center pt-12">
                    <div className="w-full max-w-screen-lg">
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton /> 
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="flex justify-center mt-6">
                <div>
                    {sortedBlogs.map(blog => (
                        <BlogCard 
                            key={blog.id}
                            id={blog.id}
                            authorName={blog.author.name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            publishedData={blog.createdAt}
                        />
                    ))}
                </div> 
            </div>
        </div>
    );
}

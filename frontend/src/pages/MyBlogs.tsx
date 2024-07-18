import { Appbar } from "../components/Appbar";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import { BlogCard } from "../components/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";


interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

interface User {
    id: number;
    username: string;
    name: string;
    about: string;
    blogs: Blog[];
}


export const MyBlogs = () => {
    const { loading, blogs } = useBlogs();
    const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setUser(response.data);
               
            } catch (e) {
                console.error('Error fetching user data', e);
            }
        };

        fetchUser();
    }, []);
    
    const currentUser = user; 

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

    // Filter blogs to show only the ones authored by the current user
    const myBlogs = sortedBlogs.filter(blog => blog.author.name === currentUser?.name);
    console.log(myBlogs);

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div> 
                    {myBlogs.map(blog => (
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
};
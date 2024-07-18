import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { BlogCard, Avatar } from '../components/BlogCard';
import { BACKEND_URL } from '../config';

interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

interface User {
    id: number;
    name: string;
    about: string;
    blogs: Blog[];
}

export const UserProfile = () => {
    const { userID } = useParams<{ userID: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    console.log(userID);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get(`${BACKEND_URL}/api/v1/user/${userID}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setUser(response.data);
            } catch (e) {
                console.error('Error fetching user data', e);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    const sortedBlogs = user.blogs.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <Appbar />
            <div className="flex justify-center py-12">
                <div className="w-full max-w-screen-md bg-white p-8 rounded-lg shadow-md text-center">
                    <Avatar size="big" name={user.name} />
                    <div className="mt-4 text-2xl font-bold text-gray-800">{user.name}</div>
                    <div className="mt-4 text-gray-600">{user.about || "No information available."}</div>
                    <div className="mt-8 text-xl font-semibold text-gray-800">
                        Total Blogs Written: {user.blogs.length}
                    </div>
                    <div className="mt-4">
                        {sortedBlogs.map((blog) => (
                            <div key={blog.id} className="mb-4">
                                <BlogCard
                                    id={blog.id}
                                    authorName={user.name || 'Anonymous'}
                                    title={blog.title}
                                    content={blog.content}
                                    publishedData={blog.createdAt}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

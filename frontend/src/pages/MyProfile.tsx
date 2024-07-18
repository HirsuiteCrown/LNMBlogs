import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appbar } from '../components/Appbar';
import { BlogCard, Avatar } from '../components/BlogCard';
import { BlogSkeleton } from '../components/BlogSkeleton';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';

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

export const MyProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingAbout, setEditingAbout] = useState(false);
    const [about, setAbout] = useState('');
    const navigate = useNavigate();

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
                setAbout(response.data.about);
            } catch (e) {
                console.error('Error fetching user data', e);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleDeleteBlog = async (blogId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
        if (!confirmDelete) {
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
                headers: {
                    Authorization: `${token}`, 
                },
            });
            // Remove the deleted blog from state
            setUser((prevUser) => ({
                ...prevUser!,
                blogs: prevUser!.blogs.filter((blog) => blog.id !== blogId),
            }));
        } catch (e) {
            console.error('Error deleting blog', e);
        }
    };

    const handleEditBlog = (blogId: number, userId: number) => {
        navigate(`/edit/blog/${userId}/${blogId}`);
    };

    const handleEditAbout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.put(`${BACKEND_URL}/api/v1/user/me`, { about }, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setEditingAbout(false);
            setUser((prevUser) => ({
                ...prevUser!,
                about: about,
            }));
        } catch (e) {
            console.error('Error updating about section', e);
        }
    };

    if (loading || !user) {
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
                    <div className="mt-4">
                        {editingAbout ? (
                            <div className="flex flex-col items-center">
                                <textarea
                                    className="border border-gray-300 rounded w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex space-x-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        onClick={handleEditAbout}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                        onClick={() => setEditingAbout(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-gray-800">{user.about}</div>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                    onClick={() => setEditingAbout(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
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
                                <div className="mt-2">
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={() => handleDeleteBlog(blog.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleEditBlog(blog.id,user.id)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



















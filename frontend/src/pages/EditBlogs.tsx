import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { BACKEND_URL } from '../config';

export const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true); 
 
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get((`${BACKEND_URL}/api/v1/blog/${id}`),{
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setTitle(response.data.blog.title);
                setContent(response.data.blog.content);
                setLoading(false);
            } catch (e) {
                console.error('Error fetching blog data', e);
            }
        };

        fetchBlog();
    }, [id]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, { title, content }, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            navigate('/profile');
        } catch (e) {
            console.error('Error updating blog', e);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Appbar />
            <div className="flex justify-center py-12">
                <div className="w-full max-w-screen-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Blog</h1>
                    <div className="mb-6">
                        <input
                            type="text"
                            className="border border-gray-300 rounded w-full p-3 text-lg focus:outline-none focus:border-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                        />
                    </div>
                    <div className="mb-6">
                        <textarea
                            className="border border-gray-300 rounded w-full p-3 text-lg h-48 resize-none focus:outline-none focus:border-blue-500"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                        />
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            onClick={() => navigate('/profile')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

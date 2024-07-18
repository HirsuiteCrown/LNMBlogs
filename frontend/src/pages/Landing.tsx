import { useNavigate } from 'react-router-dom';

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-200 to-purple-300">
            <nav className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
                <div className="text-white text-2xl font-bold">LNMBlogs</div>
                <button 
                    onClick={() => navigate('/signin')}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
                >
                    Sign In
                </button>
            </nav>
            <div className="flex flex-1 items-center justify-center flex-col text-center px-4">
                <h1 className="text-5xl font-extrabold mb-6 text-gray-800">Welcome to LNMBlogs</h1>
                <p className="text-2xl mb-6 text-gray-700">A platform by LNMIITians, for LNMIITians</p>
                <p className="text-lg mb-12 text-gray-600">Share your thoughts, ideas, and stories with the LNMIIT community.</p>
                <button 
                    onClick={() => navigate('/signup')}
                    className="text-white bg-green-600 hover:bg-green-700 px-6 py-3 rounded transition duration-300"
                >
                    Create Your Blog
                </button>
            </div>
        </div>
    );
};

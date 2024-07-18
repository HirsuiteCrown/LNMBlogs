import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";

export const Appbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    let currentUserName = "Aryan";

    return (
        <div className="bg-gray-900 shadow-md flex justify-between items-center px-10 py-4">
            <Link to={'/blogs'} className="text-white text-2xl font-bold cursor-pointer">
                LNM Blogs
            </Link>
            <div className="relative flex items-center">
                <Link to={'/publish'}>
                    <button
                        type="button"
                        className="mr-4 text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 transition duration-300"
                    >
                        New
                    </button> 
                </Link>
                <div onClick={toggleDropdown} className="relative cursor-pointer">
                    <Avatar size={"big"} name={currentUserName} />
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                            <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                Edit Profile
                            </Link>
                            <Link to="/myblogs" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                My Blogs
                            </Link>
                            <div
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate('/'); // Adjust this URL to your signin page
                                }}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

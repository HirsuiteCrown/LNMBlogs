import { ChangeEvent, useState, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupType } from "@aryandumyan/bloggingwebsite-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupType>({
        name: "",
        username: "",
        password: ""
    });

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendRequest();
        }
    };

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data.jwt;
            console.log(response);
            // const user = response.data.name;
            localStorage.setItem("token", jwt);
            // localStorage.setItem("user",user);
            toast.success(type === "signup" ? "Account created successfully!" : "Signed in successfully!");
            setTimeout(() => {
                navigate("/blogs");
            }, 2000);
        } catch (e) {
            toast.error("Error while signing up/signing in");
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 to-purple-300">
            <ToastContainer />
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="px-4">
                    <div className="text-4xl font-extrabold text-gray-800 mb-4">
                        {type === "signup" ? "Create an Account" : "Sign In"}
                    </div>
                    <div className="text-gray-600 mb-6">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline text-blue-600" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div>
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            placeholder="Aryan Dumyan..."
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value,
                                });
                            }}
                            onKeyPress={handleKeyPress}
                        />
                    )}
                    <LabelledInput
                        label="Username"
                        placeholder="aryan@gmail.com"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                username: e.target.value,
                            });
                        }}
                        onKeyPress={handleKeyPress}
                    />
                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="********"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value,
                            });
                        }}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={sendRequest}
                        type="button"
                        className="mt-8 w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
                    >
                        {type === "signup" ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

function LabelledInput({ label, placeholder, onChange, type, onKeyPress }: LabelledInputType) {
    return (
        <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-700 font-semibold">{label}</label>
            <input
                onChange={onChange}
                onKeyPress={onKeyPress}
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}

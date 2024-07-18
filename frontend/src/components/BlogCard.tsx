import { Link } from "react-router-dom";

interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedData: string; 
    id: number; // Ensure the id type is a number
} 

export const BlogCard = ({ id, authorName, title, content, publishedData }: BlogCardProps) => {
    const createdAtString = publishedData;
    const utcDate = new Date(createdAtString);
    const istDate = utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    return (
        <Link to={`/blog/${id}`}>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300 w-full max-w-screen-lg cursor-pointer">
                <div className="flex items-center mb-4">
                    <Avatar size="small" name={authorName} />
                    <div className="ml-3">
                        <div className="text-gray-700 font-semibold">{authorName}</div>
                        <div className="text-gray-500 text-sm">{istDate}</div>
                    </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{title}</div>
                <div className="text-gray-700 mb-4">
                    {content.slice(0, 100) + "..."}
                </div>
                <div className="text-gray-400 text-sm">
                    {`${Math.ceil(content.length / 200)} minute(s)`}
                </div>
            </div>
        </Link>
    );
};

export function Circle() {
    return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
}

export function Avatar({ name, size = "small" }: { name: string; size: "small" | "big" }) {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-200 rounded-full ${size === "small" ? "w-8 h-8" : "w-12 h-12"}`}>
            <span className={`${size === "small" ? "text-sm" : "text-lg"} font-bold text-gray-700`}>
                {name[0]}
            </span>
        </div>
    );
}

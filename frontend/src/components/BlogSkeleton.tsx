export const BlogSkeleton = () => {
    return (
        <div role="status" className="animate-pulse p-6 bg-white rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300 w-screen max-w-screen-lg cursor-pointer">
            <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="ml-3">
                    <div className="h-4 bg-gray-200 rounded-full mb-2.5 w-24"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-32"></div>
                </div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded-full mb-2.5 w-5/6"></div>
            <div className="text-slate-500 text-sm font-thin pt-4">
                <div className="h-4 bg-gray-200 rounded-full w-16"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

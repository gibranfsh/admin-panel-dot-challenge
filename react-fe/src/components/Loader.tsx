import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center p-64">
            <div className="border-t-8 border-blue-500 border-solid h-12 w-12 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;

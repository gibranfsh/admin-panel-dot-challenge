import { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const NavBar = () => {
    const { user, token, setToken, setUser } = useStateContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await axiosClient
            .delete("/api/v1/users/logout")
            .then(() => {
                setUser(null);
                setToken(null);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <nav className="bg-blue-500 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-white text-lg font-bold">
                    Admin Panel
                </a>

                <ul className="flex items-center">
                    <div className="">
                        {token ? (
                            // When token is available
                            <li className="relative group">
                                <button
                                    className="border text-white rounded-full p-4 hover:bg-blue-700 transition-all"
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                >
                                    Hi, {user && user.name}!
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute bg-red-500 hover:bg-red-700 shadow-md mt-2 py-2 rounded-md transition">
                                        <button
                                            className="block px-4 py-2 text-gray-800"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        ) : (
                            // When token is not available
                            <li className="border text-white rounded-full px-4 py-1 hover:bg-blue-700 transition-all mr-4">
                                <a href="/login" className="text-white">
                                    Login
                                </a>
                            </li>
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;

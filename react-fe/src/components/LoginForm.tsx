import { FormEvent, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import toast from "react-hot-toast";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser, setToken } = useStateContext();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Login form submitted", email, password);
        try {
            e.preventDefault();

            await axiosClient
                .post("/api/v1/users/login", {
                    email,
                    password,
                })
                .then(({ data }) => {
                    setToken(data.data.token);
                    setUser({
                        id: data.data.id,
                        name: data.data.name,
                        email: data.data.email,
                    });
                })
                .catch((err) => {
                    const response = err.response;
                    if (response.status === 401) {
                        toast.error("Email or password is incorrect.");
                    } else {
                        toast.error("Error logging in.");
                    }
                });
        } catch (error) {
            toast.error("Error logging in.");
            console.error(error);
        }
    };

    return (
        <form className="max-w-md mx-auto mt-8" onSubmit={handleLogin}>
            <div className="mb-4">
                <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Email:
                </label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-6">
                <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginForm;

import LoginForm from "../components/LoginForm";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

const Login = () => {
    const { token } = useStateContext();

    if (token) {
        return <Navigate to="/clients" />;
    }

    return (
        <div className="min-h-screen bg-primary/20 flex items-center justify-center">
            <div className="p-8 w-1/3 shadow-md bg-white rounded-lg">
                <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;

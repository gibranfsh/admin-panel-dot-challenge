import ClientsTable from "../components/ClientsTable";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

const Clients = () => {
    const { token } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <ClientsTable />;
};

export default Clients;

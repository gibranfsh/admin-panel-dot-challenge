import ProjectsTable from "../components/ProjectsTable";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

const Projects = () => {
    const { token } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <ProjectsTable />;
};

export default Projects;

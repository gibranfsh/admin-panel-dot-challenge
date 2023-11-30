import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Clients from "./views/Clients";
import Projects from "./views/Projects";
import NavBar from "./components/Navbar";
import { ContextProvider } from "./contexts/ContextProvider";
import ToasterContext from "./contexts/ToasterContext";

function App() {
    return (
        <ContextProvider>
            <ToasterContext />
            <NavBar />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route
                        path="/clients/:id/projects"
                        element={<Projects />}
                    />
                    <Route path="*" element={<Navigate to="/clients" />} />
                </Routes>
            </BrowserRouter>
        </ContextProvider>
    );
}

export default App;

import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Clients from "./views/Clients";
import Projects from "./views/Projects";
//   import { ContextProvider } from './contexts/ContextProvider'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id/projects" element={<Projects />} />
                <Route path="*" element={<Navigate to="/clients" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

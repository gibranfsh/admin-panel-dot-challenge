import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { convertISODateToFormattedString } from "./Route";
import Loader from "./Loader";

interface Project {
    id: number;
    title: string;
    description: string;
    platform: string;
    status: "ON_PROGRESS" | "FINISHED" | "CANCELLED";
    start_date: string;
    end_date: string;
    created_at: string;
}

const ProjectsTable = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [newProjectData, setNewProjectData] = useState({
        title: "",
        description: "",
        platform: "",
        status: "ON_PROGRESS",
        start_date: "",
        end_date: "",
    });
    const navigate = useNavigate();
    const { token } = useStateContext();
    const { id } = useParams();

    const { data: projectsData } = useSWR(
        token && id ? `/api/v1/clients/${id}/projects` : null,
        (url) =>
            axiosClient.get(url).then((response) => {
                setIsLoading(false);
                return response.data.data as Project[];
            })
    );

    const handleCreate = async () => {
        // send API POST request to /api/v1/clients/:id/projects
        try {
            const res = await axiosClient.post(
                `/api/v1/clients/${id}/projects`,
                newProjectData
            );

            if (res.status === 201) {
                toast.success("Client created successfully");
                setNewProjectData({
                    title: "",
                    description: "",
                    platform: "",
                    status: "ON_PROGRESS",
                    start_date: "",
                    end_date: "",
                });
                setShowCreateModal(false);
                await mutate(`/api/v1/clients/${id}/projects`);
            } else {
                toast.error("Error creating client");
            }
        } catch (error) {
            const errorResponse = Object.values(
                errors.response.data.errors
            ).join(" ");
            toast.error(errorResponse);
            console.error(error);
            setShowCreateModal(false);
        }
    };

    const handleEdit = async () => {
        // send API PUT request to /api/v1/clients/:id/projects/:id
        try {
            const res = await axiosClient.put(
                `/api/v1/clients/${id}/projects/${selectedProject?.id}`,
                selectedProject
            );

            if (res.status === 200) {
                toast.success("Project updated successfully");
                setShowEditModal(false);
                await mutate(`/api/v1/clients/${id}/projects`);
            } else {
                toast.error("Error updating project");
            }
        } catch (error) {
            const errorResponse = Object.values(
                errors.response.data.errors
            ).join(" ");
            toast.error(errorResponse);
            console.error(error);
            setShowEditModal(false);
        }
    };

    const handleDelete = async () => {
        // send API DELETE request to /api/v1/clients/:id/projects/:id
        try {
            const res = await axiosClient.delete(
                `/api/v1/clients/${id}/projects/${selectedProject?.id}`
            );

            if (res.status === 200) {
                toast.success("Project deleted successfully");
                setShowDeleteModal(false);
                await mutate(`/api/v1/clients/${id}/projects`);
            } else {
                toast.error("Error deleting project");
            }
        } catch (error) {
            const errorResponse = Object.values(
                errors.response.data.errors
            ).join(" ");
            toast.error(errorResponse);
            console.error(error);
            setShowDeleteModal(false);
        }
    };

    const openCreateModal = () => setShowCreateModal(true);
    const openEditModal = (project: Project) => {
        setSelectedProject(project);
        setShowEditModal(true);
    };
    const openDeleteModal = (project: Project) => {
        setSelectedProject(project);
        setShowDeleteModal(true);
    };

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-2xl font-bold">Projects</h1>
            {/* Button to get back to the /clients page */}
            <button
                className="bg-slate-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => navigate("/clients")}
            >
                Back to Clients
            </button>
            {/* Button to trigger Create Modal */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
                onClick={() => openCreateModal()}
            >
                Create Project
            </button>

            {/* Table */}
            <table className="min-w-full border bg-white mt-4">
                <thead>
                    <tr>
                        <th className="border p-3">Title</th>
                        <th className="border p-3">Description</th>
                        <th className="border p-3">Platform</th>
                        <th className="border p-3">Status</th>
                        <th className="border p-3">Start Date</th>
                        <th className="border p-3">End Date</th>
                        <th className="border p-3">Created At</th>
                        <th className="border p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading ? (
                        projectsData?.length && projectsData?.length > 0 ? (
                            projectsData?.map((project: Project) => (
                                <tr
                                    key={project.id}
                                    className="border-b cursor-pointer hover:shadow-md transition"
                                >
                                    <td className="border p-3">
                                        {project.title}
                                    </td>
                                    <td className="border p-3">
                                        {project.description}
                                    </td>
                                    <td className="border p-3">
                                        {project.platform}
                                    </td>
                                    <td className="border p-3">
                                        {project.status}
                                    </td>
                                    <td className="border p-3">
                                        {project.start_date}
                                    </td>
                                    <td className="border p-3">
                                        {project.end_date}
                                    </td>
                                    <td className="border p-3">
                                        {convertISODateToFormattedString(
                                            new Date(project.created_at)
                                        )}
                                    </td>
                                    <td className="border p-3">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() =>
                                                openEditModal(project)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() =>
                                                openDeleteModal(project)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center p-5">
                                    No projects found.
                                </td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan={8}>
                                <Loader />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
                        <input
                            type="text"
                            value={newProjectData.title}
                            onChange={(e) =>
                                setNewProjectData({
                                    ...newProjectData,
                                    title: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 w-full"
                            placeholder="Title"
                        />

                        <textarea
                            value={newProjectData.description}
                            onChange={(e) =>
                                setNewProjectData({
                                    ...newProjectData,
                                    description: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 resize-none w-full"
                            placeholder="Description"
                        />

                        <input
                            type="text"
                            value={newProjectData.platform}
                            onChange={(e) =>
                                setNewProjectData({
                                    ...newProjectData,
                                    platform: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 w-full"
                            placeholder="Platform"
                        />

                        <select
                            value={newProjectData.status}
                            onChange={(e) =>
                                setNewProjectData({
                                    ...newProjectData,
                                    status: e.target.value as
                                        | "ON_PROGRESS"
                                        | "FINISHED"
                                        | "CANCELLED",
                                })
                            }
                            className="border p-2 mb-2 w-full"
                        >
                            <option value="ON_PROGRESS">On Progress</option>
                            <option value="FINISHED">Finished</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                        <input
                            type="date"
                            value={newProjectData.start_date}
                            onChange={(e) =>
                                setNewProjectData({
                                    ...newProjectData,
                                    start_date: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 w-full"
                            placeholder="Start Date"
                        />

                        <input
                            type="date"
                            value={newProjectData.end_date}
                            onChange={(e) =>
                                setNewProjectData({
                                    ...newProjectData,
                                    end_date: e.target.value,
                                })
                            }
                            className="border p-2 mb-4 w-full"
                            placeholder="End Date"
                        />

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => handleCreate()}
                        >
                            Create
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedProject && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
                        <input
                            type="text"
                            value={selectedProject.title}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject,
                                    title: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 w-full"
                            placeholder="Title"
                        />

                        <textarea
                            value={selectedProject.description}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject,
                                    description: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 resize-none w-full"
                            placeholder="Description"
                        />

                        <input
                            type="text"
                            value={selectedProject.platform}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject,
                                    platform: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 w-full"
                            placeholder="Platform"
                        />

                        <select
                            value={selectedProject.status}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject,
                                    status: e.target.value as
                                        | "ON_PROGRESS"
                                        | "FINISHED"
                                        | "CANCELLED",
                                })
                            }
                            className="border p-2 mb-2 w-full"
                        >
                            <option value="ON_PROGRESS">On Progress</option>
                            <option value="FINISHED">Finished</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                        <input
                            type="date"
                            value={selectedProject.start_date}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject,
                                    start_date: e.target.value,
                                })
                            }
                            className="border p-2 mb-2 w-full"
                            placeholder="Start Date"
                        />

                        <input
                            type="date"
                            value={selectedProject.end_date}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject,
                                    end_date: e.target.value,
                                })
                            }
                            className="border p-2 mb-4 w-full"
                            placeholder="End Date"
                        />

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => handleEdit()}
                        >
                            Update
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedProject && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
                        <p className="mb-2">
                            Are you sure you want to delete this project?
                        </p>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => handleDelete()}
                        >
                            Delete
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsTable;

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../axios-client";
import useSWR, { mutate } from "swr";
import { useStateContext } from "../contexts/ContextProvider";
import toast from "react-hot-toast";
import { convertISODateToFormattedString } from "./Route";
import Loader from "./Loader";

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
}

const ClientsTable = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [newClientData, setNewClientData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const navigate = useNavigate();
    const { token } = useStateContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    // Separate search terms for name, email, and phone
    const nameSearch = searchParams.get("name") || "";
    const emailSearch = searchParams.get("email") || "";
    const phoneSearch = searchParams.get("phone") || "";

    const { data: clientsData } = useSWR(
        token
            ? `/api/v1/clients?page=${currentPage}&name=${nameSearch}&email=${emailSearch}&phone=${phoneSearch}`
            : null,
        (url) =>
            axiosClient.get(url).then((response) => {
                setIsLoading(false);
                return response.data as Client[];
            })
    );

    const handleCreate = async () => {
        // send API POST request to /api/v1/clients
        try {
            const res = await axiosClient.post("/api/v1/clients", {
                name: newClientData.name,
                email: newClientData.email,
                phone: newClientData.phone,
            });

            if (res.status === 201) {
                toast.success("Client created successfully");
                setNewClientData({
                    name: "",
                    email: "",
                    phone: "",
                });
                setShowCreateModal(false);
                // mutate
                await mutate("/api/v1/clients");
            } else {
                toast.error("Error creating client:");
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
        //send API PUT request to /api/v1/clients/:id
        try {
            const res = await axiosClient.put(
                `/api/v1/clients/${selectedClient?.id}`,
                {
                    name: selectedClient?.name,
                    email: selectedClient?.email,
                    phone: selectedClient?.phone,
                }
            );

            if (res.status === 200) {
                toast.success("Client updated successfully");
                setShowEditModal(false);
                // mutate
                await mutate("/api/v1/clients");
            } else {
                toast.error("Error updating client:");
                setShowEditModal(false);
            }
        } catch (errors) {
            const error = Object.values(errors.response.data.errors).join(" ");
            toast.error(error);
            console.error(errors);
            setShowEditModal(false);
        }
        setShowEditModal(false);
    };

    const handleDelete = async () => {
        // send API DELETE request to /api/v1/clients/:id
        try {
            const res = await axiosClient.delete(
                `/api/v1/clients/${selectedClient?.id}`
            );

            if (res.status === 204) {
                toast.success("Client deleted successfully");
                setShowDeleteModal(false);
                // mutate
                await mutate("/api/v1/clients");
            } else {
                toast.error("Error deleting client:");
                setShowDeleteModal(false);
            }
        } catch (errors) {
            const error = Object.values(errors.response.data.errors).join(" ");
            toast.error(error);
            console.error(errors);
            setShowDeleteModal(false);
        }
        setShowDeleteModal(false);
    };

    const openCreateModal = () => setShowCreateModal(true);
    const openEditModal = (client: Client) => {
        setSelectedClient(client);
        setShowEditModal(true);
    };
    const openDeleteModal = (client: Client) => {
        setSelectedClient(client);
        setShowDeleteModal(true);
    };

    const renderPagination = () => {
        const pages = [];

        for (let i = 1; i <= clientsData?.meta.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => {
                        setIsLoading(true);
                        navigate(`/clients?page=${i}`);
                    }}
                    className={`mx-1 px-4 py-2 bg-blue-500 text-white rounded ${
                        i === clientsData?.meta.current_page
                            ? "bg-blue-700"
                            : ""
                    }`}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    const handleSearchByName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        setSearchParams({ page: "1", name: e.target.value });
    };

    const handleSearchByEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        setSearchParams({ page: "1", email: e.target.value });
    };

    const handleSearchByPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        setSearchParams({ page: "1", phone: e.target.value });
    };

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-2xl font-bold">Clients</h1>
            {/* Add search inputs */}
            <div className="flex space-x-4 mt-4">
                <input
                    type="text"
                    value={nameSearch}
                    onChange={handleSearchByName}
                    placeholder="Search by name"
                    className="border p-2"
                />
                <input
                    type="text"
                    value={emailSearch}
                    onChange={handleSearchByEmail}
                    placeholder="Search by email"
                    className="border p-2"
                />
                <input
                    type="text"
                    value={phoneSearch}
                    onChange={handleSearchByPhone}
                    placeholder="Search by phone"
                    className="border p-2"
                />
            </div>

            {/* Button to trigger Create Modal */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 right-0"
                onClick={() => openCreateModal()}
            >
                Create Client
            </button>

            {/* Table */}
            <table className="min-w-full border bg-white mt-4">
                <thead>
                    <tr>
                        <th className="border p-3">Client ID</th>
                        <th className="border p-3">Name</th>
                        <th className="border p-3">Email</th>
                        <th className="border p-3">Phone</th>
                        <th className="border p-3">Created At</th>
                        <th className="border p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading ? (
                        clientsData?.data?.length > 0 ? (
                            clientsData?.data?.map((client: Client) => (
                                <tr
                                    key={client.id}
                                    className="border-b cursor-pointer hover:shadow-md transition"
                                    // redirect to the client's page when the row is clicked
                                >
                                    <td className="border p-3">{client.id}</td>
                                    <td className="border p-3">
                                        {client.name}
                                    </td>
                                    <td className="border p-3">
                                        {client.email}
                                    </td>
                                    <td className="border p-3">
                                        {client.phone}
                                    </td>
                                    <td className="border p-3">
                                        {convertISODateToFormattedString(
                                            new Date(client.created_at)
                                        )}
                                    </td>
                                    <td className="border p-3">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() =>
                                                openEditModal(client)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() =>
                                                openDeleteModal(client)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={() =>
                                                navigate(
                                                    `/clients/${client.id}/projects`
                                                )
                                            }
                                        >
                                            See Projects
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            clientsData?.data?.length > 0 && (
                                <tr>
                                    <td
                                        className="border p-3 text-center"
                                        colSpan={6}
                                    >
                                        No clients found.
                                    </td>
                                </tr>
                            )
                        )
                    ) : (
                        <tr>
                            <td className="border p-3 text-center" colSpan={6}>
                                <Loader />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {clientsData?.meta && (
                <div className="mt-4 flex justify-center">
                    {renderPagination()}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
                        <input
                            type="text"
                            value={newClientData.name}
                            onChange={(e) =>
                                setNewClientData({
                                    ...newClientData,
                                    name: e.target.value,
                                })
                            }
                            className="border p-2 mb-2"
                            placeholder="Name"
                        />

                        <input
                            type="text"
                            value={newClientData.email}
                            onChange={(e) =>
                                setNewClientData({
                                    ...newClientData,
                                    email: e.target.value,
                                })
                            }
                            className="border p-2 mb-2"
                            placeholder="Email"
                        />

                        <input
                            type="text"
                            value={newClientData.phone}
                            onChange={(e) =>
                                setNewClientData({
                                    ...newClientData,
                                    phone: e.target.value,
                                })
                            }
                            className="border p-2 mb-4"
                            placeholder="Phone"
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
            {showEditModal && selectedClient && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
                        {/* tampilkan data selectedClient pada input box dan bisa diubah-ubah */}
                        <input
                            type="text"
                            value={selectedClient.name}
                            onChange={(e) =>
                                setSelectedClient({
                                    ...selectedClient,
                                    name: e.target.value,
                                })
                            }
                            className="border p-2 mb-2"
                            placeholder="Name"
                        />

                        <input
                            type="text"
                            value={selectedClient.email}
                            onChange={(e) =>
                                setSelectedClient({
                                    ...selectedClient,
                                    email: e.target.value,
                                })
                            }
                            className="border p-2 mb-2"
                            placeholder="Email"
                        />

                        <input
                            type="text"
                            value={selectedClient.phone}
                            onChange={(e) =>
                                setSelectedClient({
                                    ...selectedClient,
                                    phone: e.target.value,
                                })
                            }
                            className="border p-2 mb-4"
                            placeholder="Phone"
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
            {showDeleteModal && selectedClient && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center">
                        <p>
                            Are you sure you want to delete the following
                            client?
                        </p>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
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

export default ClientsTable;

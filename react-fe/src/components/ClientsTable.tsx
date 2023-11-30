import { useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyData = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        createdAt: "2023-01-01",
    },
    {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "987-654-3210",
        createdAt: "2023-01-02",
    },
    // Add more dummy data as needed
];

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}

const ClientsTable = () => {
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

    // Assuming you have some functions for handling CRUD operations
    // You should replace these with your actual functions or API calls
    const handleCreate = () => {
        console.log(newClientData);
        setShowCreateModal(false);
    };

    const handleEdit = () => {
        console.log(selectedClient);
        setShowEditModal(false);
    };

    const handleDelete = () => {
        console.log(selectedClient);
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

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-2xl font-bold">Clients</h1>
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
                        <th className="border p-3">Name</th>
                        <th className="border p-3">Email</th>
                        <th className="border p-3">Phone</th>
                        <th className="border p-3">Created At</th>
                        <th className="border p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyData.map((client) => (
                        <tr
                            key={client.id}
                            className="border-b cursor-pointer hover:shadow-md transition"
                            // redirect to the client's page when the row is clicked
                        >
                            <td className="border p-3">{client.name}</td>
                            <td className="border p-3">{client.email}</td>
                            <td className="border p-3">{client.phone}</td>
                            <td className="border p-3">{client.createdAt}</td>
                            <td className="border p-3">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => openEditModal(client)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => openDeleteModal(client)}
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
                    ))}
                </tbody>
            </table>

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

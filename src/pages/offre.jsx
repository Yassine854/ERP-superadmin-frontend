import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../components/CreateModal';
import axios from '../axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

export default function OffreManager() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', prix: '' });
    const [errors, setErrors] = useState({});
    const [offres, setOffres] = useState([]);
    const [pending, setPending] = useState(true);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => { fetchOffres(); }, []);

    const fetchOffres = async () => {
        try {
            const response = await axios.get('/offres');
            setOffres(response.data);
        } catch (error) {
            console.error('Error fetching offres:', error);
        } finally {
            setPending(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', prix: '' });
        setErrors({});
        setSelectedOffre(null);
    };

    const handleModalOpen = (offre = null) => {
        setIsEditing(!!offre);
        setSelectedOffre(offre);
        setFormData(offre || { title: '', description: '', prix: '' });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = isEditing
                ? await axios.put(`/offres/update/${selectedOffre._id}`, formData)
                : await axios.post('/offres/create', formData);

            if (resp.status === 200 || resp.status === 201) {
                setAlertMessage(isEditing ? "Offre mis à jour avec succès." : "Offre créée avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
                fetchOffres();
                handleModalClose();
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error saving offre:', error);
            }
        }
    };

    const handleDelete = async (_id) => {
        Swal.fire({
            title: "Êtes-vous sûre?",
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, Supprimer!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/offres/destroy/${_id}`);
                    setAlertMessage("Offre supprimé avec succès.");
                    setTimeout(() => {
                        setAlertMessage('');
                    }, 3000);
                    fetchOffres();
                } catch (error) {
                    console.error('Error deleting offre:', error);
                }
            }
        });
    };

    const columns = [
        { name: 'ID', selector: (row) => row._id, sortable: true },
        { name: 'Titre', selector: (row) => row.title, sortable: true },
        { name: 'Description', selector: (row) => row.description, sortable: true },
        { name: 'Prix', selector: (row) => row.prix, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex items-center space-x-4">
                    <button onClick={() => handleModalOpen(row)} className="text-blue-600 hover:text-blue-800 flex items-center">
                        <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                    </button>
                    <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800 flex items-center">
                        <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            {alertMessage && (
                <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg">
                    {alertMessage}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={isEditing ? "Modifier Offre" : "Ajouter Offre"}
                onSubmit={handleSubmit}
                footer={
                    <>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            {isEditing ? 'Modifier' : 'Ajouter'}
                        </button>
                        <button
                            type="button"
                            className="ml-3 bg-gray-100 text-gray-600 border rounded-lg text-sm px-5 py-2.5"
                            onClick={handleModalClose}
                        >
                            Annuler
                        </button>
                    </>
                }
            >
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Titre</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                        placeholder="Titre du offre"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    {errors.title && <p className="text-sm text-red-600">{errors.title[0]}</p>}

                    <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                        placeholder="Description du offre"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}

                    <label htmlFor="prix" className="block mt-4 mb-2 text-sm font-medium text-gray-900">Prix</label>
                    <input
                        type="text"
                        name="prix"
                        id="prix"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                        placeholder="Prix du offre"
                        value={formData.prix}
                        onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                        required
                    />
                    {errors.prix && <p className="text-sm text-red-600">{errors.prix[0]}</p>}
                </div>
            </Modal>

            <div className="flex justify-between items-center mt-8 mb-4">
                <h1 className="text-3xl font-bold">Gestion des Offres</h1>
                <button
                    onClick={() => handleModalOpen()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Ajouter Offre
                </button>
            </div>
            <DataTable
                columns={columns}
                data={offres}
                pagination
                highlightOnHover
                progressPending={pending}
                customStyles={{
                    headCells: {
                        style: {
                            color: '#202124',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        },
                    },
                }}
            />
        </>
    );
}

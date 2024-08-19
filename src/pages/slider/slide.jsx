import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../components/CreateModal'; // Assurez-vous que ce composant gère les soumissions de formulaire
import axios from '../../axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const SliderAdmin = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', image: null });
    const [sliders, setSliders] = useState([]);
    const [pending, setPending] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [admin, setAdmin] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [selectedSlider, setSelectedSlider] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');


    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
      };


    // Récupérer les sliders depuis le serveur
    const fetchSliders = async () => {
        try {
            const response = await axios.get(`/sliders/${id}`);
            setSliders(response.data.sliders);
            setAdmin(response.data.admin.name)
            setPending(false);
        } catch (error) {
            console.error('Échec de la récupération des sliders :', error);
        }
    };

    // Récupérer les sliders au montage du composant et lorsque l'id change
    useEffect(() => {
        fetchSliders();
    }, [id]);

    // Réinitialiser le formulaire et l'état de la modal lorsqu'elle est fermée
    useEffect(() => {
        if (!isModalOpen) {
            setFormData({ title: '', description: '', image: null });
            setEditMode(false);
            setSelectedSlider(null);
        } else if (editMode && selectedSlider) {
            setFormData({
                title: selectedSlider.title,
                description: selectedSlider.description,
                image: null,
            });
            // console.log(capitalize(admin));
        }
    }, [isModalOpen, editMode, selectedSlider]);

    // Gérer la soumission du formulaire pour créer/modifier
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        if (formData.image) form.append('image', formData.image);
        console.log(form);

        try {
            if (editMode && selectedSlider) {
                await axios.post(`/sliders/update/${selectedSlider._id}`, form);
                setAlertMessage("Slide mis à jour avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            } else {
                await axios.post(`/sliders/create/${id}`, form);
                setAlertMessage("Slide créée avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
            fetchSliders();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour/création du slider :", error);
        }
    };

    // Gérer les changements des inputs
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: files ? files[0] : value }));
    };

    // Gérer le clic sur le bouton modifier
    const handleEdit = (slider) => {
        setSelectedSlider(slider);
        setEditMode(true);
        setIsModalOpen(true);
    };

    // Gérer le clic sur le bouton supprimer
    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Êtes-vous sûr ?",
                text: "Vous ne pourrez pas revenir en arrière !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, supprimez-le !",
            });

            if (result.isConfirmed) {
                await axios.delete(`/sliders/delete/${id}`);
                fetchSliders();
                setAlertMessage("Slide supprimé avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Échec de la suppression du slider :', error);
        }
    };

    const columns = [
        { name: 'ID', selector: row => row._id, sortable: true },
        { name: 'Titre', selector: row => row.title, sortable: true },
        { name: 'Description', selector: row => row.description, sortable: true },
        { name: 'Image', cell: row => (
            <img src={`https://example.shop/storage/img/sliders/${row.image}`} alt={row.title} style={{ width: '100px', height: 'auto' }} />
        )},
        { name: 'Actions', cell: row => (
            <div className="flex space-x-2">
                <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800">
                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                </button>
                <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800">
                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
                </button>
            </div>
        )}
    ];

    const customStyles = {
        headRow: { style: { border: 'none' } },
        headCells: { style: { color: '#202124', fontSize: '14px', fontWeight: 'bold' } },
        rows: { style: { minHeight: '56px' }, highlightOnHoverStyle: { backgroundColor: 'rgb(230, 244, 244)', borderBottomColor: '#FFFFFF', borderRadius: '25px', outline: '1px solid #FFFFFF' } },
        pagination: { style: { border: 'none' } },
    };

    return (
        <>
            {alertMessage && (
                <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg">
                    {alertMessage}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({ title: '', description: '', image: null });
                    setTitleError('');
                    setDescriptionError('');
                    setEditMode(false);
                    setSelectedSlider(null);
                }}
                title={editMode ? "Modifier le slide" : "Ajouter un slide"}
                onSubmit={handleSubmit}
                footer={(
                    <>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {editMode ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                        <button
                            type="button"
                            className="ml-3 bg-gray-100 transition duration-150 ease-in-out text-gray-600 hover:border-gray-400 hover:bg-gray-300 border rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:border-gray-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Annuler
                        </button>
                    </>
                )}
            >
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Titre
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Titre du slider"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    {titleError && <p className="text-sm text-red-600">{titleError}</p>}
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Description du slider"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    {descriptionError && <p className="text-sm text-red-600">{descriptionError}</p>}
                </div>
                <div>
                    <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Image
                    </label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={handleChange}
                        accept="image/*"
                    />
                </div>
            </Modal>

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Les Slides de {capitalizeFirstLetter(admin)}
                        </h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Ajouter slide
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 px-4 sm:px-6 lg:px-8">
                <DataTable
                    columns={columns}
                    data={sliders}
                    pagination
                    progressPending={pending}
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>
        </>
    );
};

export default SliderAdmin;

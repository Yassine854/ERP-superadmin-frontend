import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../components/CreateModal';
import axios from '../../axios';
import Swal from 'sweetalert2';
import { useParams,useLocation,useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import NatureModal from './natureModal';
import {Button, Form } from 'react-bootstrap';

const Parametres = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nature_id: '', description: '', key_word: '', temps_travail: '',
        email: '', url_fb: '', url_insta: '', url_youtube: '',
        url_tiktok: '', url_twiter: '', mode_payement: ''
    });
    const [parametres, setParametres] = useState([]);
    const [pending, setPending] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');
    const [selectedParametre, setSelectedParametre] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [natures, setNatures] = useState([]);
    const [openAddNature, setOpenAddNature] = useState(false);
    const [newNature, setNewNature] = useState('');
    const location = useLocation();
    const { adminName } = location.state || {};
    const navigate = useNavigate();
    // Fetch parameters from the server
    const fetchParametres = async () => {
        try {
            const response = await axios.get(`/parametres/${id}`);
            setParametres(response.data.parametres);
            setPending(false);
        } catch (error) {
            console.error('Échec de la récupération des paramètres :', error);
        }
    };

    // Fetch parameters on component mount and when id changes
    useEffect(() => {
        const fetchNatures = async () => {
            try {
                const response = await axios.get('/natures');
                setNatures(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des natures:', error);
            }
        };
        fetchNatures();
        fetchParametres();
    }, [id]);

    // Reset form and modal state when closed
    useEffect(() => {
        if (!isModalOpen) {
            setFormData({
                nature_id: '', description: '', key_word: '', temps_travail: '',
                email: '', url_fb: '', url_insta: '', url_youtube: '',
                url_tiktok: '', url_twiter: '', mode_payement: ''
            });
            setEditMode(false);
            setSelectedParametre(null);
        } else if (editMode && selectedParametre) {
            setFormData({
                nature_id: selectedParametre.nature || '',
                description: selectedParametre.description || '',
                key_word: selectedParametre.key_word || '',
                temps_travail: selectedParametre.temps_travail || '',
                email: selectedParametre.email || '',
                url_fb: selectedParametre.url_fb || '',
                url_insta: selectedParametre.url_insta || '',
                url_youtube: selectedParametre.url_youtube || '',
                url_tiktok: selectedParametre.url_tiktok || '',
                url_twiter: selectedParametre.url_twiter || '',
                mode_payement: selectedParametre.mode_payement || ''
            });
        }
    }, [isModalOpen, editMode, selectedParametre]);

    const handleOpenAddNature = () => {
        setOpenAddNature(true);
    };

    const handleCloseAddNature = () => {
        setNewNature('');
        setOpenAddNature(false);
    };

const handleAddNature = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/natures', { name: newNature });
        if (response.status === 201) {
            setNatures([...natures, response.data]);
            setNewNature('');
            setOpenAddNature(false);
            setAlertMessage("Nature ajoutée avec succès.");
            setTimeout(() => setAlertMessage(''), 3000);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la nature:', error);
    }
};

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode && selectedParametre) {
                await axios.put(`/parametres/update/${selectedParametre._id}`, formData);
                setAlertMessage("Paramètre mis à jour avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            } else {
                await axios.post(`/parametres/create/${id}`, formData);
                setAlertMessage("Paramètre créé avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
            fetchParametres();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour/création du paramètre :", error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handle edit button click
    const handleEdit = (parametre) => {
        setSelectedParametre(parametre);
        setEditMode(true);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Êtes-vous sûr ?",
                text: "Vous ne pourrez pas revenir en arrière !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, supprimez-le !",
            });

            if (result.isConfirmed) {
                await axios.delete(`/parametres/delete/${id}`);
                fetchParametres();
                setAlertMessage("Paramètre supprimé avec succès.");
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Échec de la suppression du paramètre :', error);
        }
    };

    const columns = [
    { name: 'ID', selector: row => row._id, sortable: true },
    { name: 'Nature', selector: row => row.nature.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    {
        name: 'Mode de Paiement',
        selector: row => row.mode_payement,
        sortable: true,
        cell: row => {
            let color;
            switch (row.mode_payement) {
                case 'en ligne':
                    color = 'bg-green-200 text-green-800';
                    break;
                case 'à la livraison':
                    color = 'bg-yellow-200 text-yellow-800';
                    break;
                case 'sans paiement':
                    color = 'bg-red-200 text-red-800';
                    break;
                default:
                    color = 'bg-gray-200 text-gray-800';
            }
            return (
                <div className={`p-2 rounded ${color}`}>
                    {row.mode_payement}
                </div>
            );
        }
    },
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


<NatureModal
                isOpen={openAddNature}
                onClose={handleCloseAddNature}
                title="Ajouter Nouvelle Nature"
                onSubmit={handleAddNature}
                footer={(
                    <>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Ajouter
                        </button>
                        <button
                            type="button"
                            className="ml-3 bg-gray-100 transition duration-150 ease-in-out text-gray-600 hover:border-gray-400 hover:bg-gray-300 border rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:border-gray-500"
                            onClick={handleCloseAddNature}
                        >
                            Annuler
                        </button>
                    </>
                )}
            >
                <div>
                    <label htmlFor="nature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nature d'entreprise
                    </label>
                    <input
                        type="text"
                        id="nature"
                        value={newNature}
                        onChange={(e) => setNewNature(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Nom de la nature"
                        required
                    />
                </div>
            </NatureModal>



            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({
                        nature: '', description: '', key_word: '', temps_travail: '',
                        email: '', url_fb: '', url_insta: '', url_youtube: '',
                        url_tiktok: '', url_twiter: '', mode_payement: ''
                    });
                    setDescriptionError('');
                    setEditMode(false);
                    setSelectedParametre(null);
                }}
                title={editMode ? "Modifier le paramètre" : "Ajouter un paramètre"}
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
                style={{ width: '80%', maxWidth: '800px' }} // Make the modal larger
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label htmlFor="nature" className="block text-sm font-medium text-gray-700">Nature d'entreprise</label>
                    <select
    id="nature_id"
    name="nature_id"
    value={formData.nature_id}
    onChange={handleChange}
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    required
>
    <option value="">Sélectionner une nature</option>
    {natures.map(nature => (
        <option key={nature._id} value={nature._id}>
            {nature.name}
        </option>
    ))}

</select>


                </div>

                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Description du paramètre"
                            value={formData.description}
                            onChange={handleChange}

                        />
                        {descriptionError && <p className="text-sm text-red-600">{descriptionError}</p>}
                    </div>
                    <div>
                        <label htmlFor="key_word" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Mot Clé
                        </label>
                        <input
                            type="text"
                            name="key_word"
                            id="key_word"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Mot clé du paramètre"
                            value={formData.key_word}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="temps_travail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Temps de Travail
                        </label>
                        <input
                            type="text"
                            name="temps_travail"
                            id="temps_travail"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Temps de travail du paramètre"
                            value={formData.temps_travail}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Email du paramètre"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="url_fb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            URL Facebook
                        </label>
                        <input
                            type="text"
                            name="url_fb"
                            id="url_fb"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="URL Facebook du paramètre"
                            value={formData.url_fb}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="url_insta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            URL Instagram
                        </label>
                        <input
                            type="text"
                            name="url_insta"
                            id="url_insta"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="URL Instagram du paramètre"
                            value={formData.url_insta}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="url_youtube" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            URL YouTube
                        </label>
                        <input
                            type="text"
                            name="url_youtube"
                            id="url_youtube"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="URL YouTube du paramètre"
                            value={formData.url_youtube}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="url_tiktok" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            URL TikTok
                        </label>
                        <input
                            type="text"
                            name="url_tiktok"
                            id="url_tiktok"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="URL TikTok du paramètre"
                            value={formData.url_tiktok}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="url_twiter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            URL Twitter
                        </label>
                        <input
                            type="text"
                            name="url_twiter"
                            id="url_twiter"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="URL Twitter du paramètre"
                            value={formData.url_twiter}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
    <label htmlFor="mode_payement" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Mode de Paiement
    </label>
    <select
        name="mode_payement"
        id="mode_payement"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        value={formData.mode_payement}
        onChange={handleChange}
    >
        <option value="">Sélectionnez un mode de paiement</option>
        <option value="en ligne">En ligne</option>
        <option value="à la livraison">À la livraison</option>
        <option value="sans paiement">Sans paiement</option>
    </select>
</div>

                </div>
            </Modal>
            <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-extrabold text-gray-800">Gestion des Paramétres</h1>
                    <h2 className="text-2xl font-semibold text-gray-600 mt-2">Admin: <span className="text-gray-800">{adminName}</span></h2>
                </div>
            <div className="flex justify-between items-center mt-8 mb-4">

                <button
                    onClick={() => navigate('/parametres/admins')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Retour aux admins
                </button>



                <div className="flex flex-col space-y-4">
    {parametres.length < 1 && (
    <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
        Ajouter Paramétre
    </button>
)}

    <button
        onClick={handleOpenAddNature}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
        Ajouter Nature d'entreprise
    </button>
</div>

            </div>


            <div className="mt-8 px-4 sm:px-6 lg:px-8">
                <DataTable
                    columns={columns}
                    data={parametres}
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

export default Parametres;

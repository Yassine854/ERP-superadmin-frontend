import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from 'react-data-table-component';
import Modal from '../components/CreateModal';
import axios from '../axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faLock,faLockOpen } from '@fortawesome/free-solid-svg-icons';

export default function Admin() {
    const { admin, setAdmin } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', cpassword: '', tel: '', city: '', address: '', zip: '' });
    const [telError, setTelError] = useState('');
    const [cityError, setCityError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [zipError, setZipError] = useState('');    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [admins, setAdmins] = useState([]); // State to store admins
    const [pending, setPending] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); // State to store alert message
    const tunisianCities = [
        'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia', 'Kairouan', 'Sfax',
        'Gabès', 'Mednine', 'Tataouine', 'Kasserine', 'Jendouba', 'Siliana', 'Zaghouan', 'Bizerte', 'Beja', 'Kebili',
        'Gafsa', 'Sidi Bouzid', 'Médénine', 'Tozeur', 'Kef'
      ];
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('/admins');
            setAdmins(response.data.admins);
            setPending(false);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    useEffect(() => {

        fetchAdmins();
    }, []);

    useEffect(() => {
        // Reset form data and errors when modal opens or closes
        if (!isModalOpen) {
            setFormData({ name: '', email: '', password: '', cpassword: '', tel: '', city: '', address: '', zip: '' });
            setNameError('');
            setEmailError('');
            setPasswordError('');
            setTelError('');
            setCityError('');
            setAddressError('');
            setZipError('');
            setEditMode(false);
            setSelectedAdmin(null);
        } else if (editMode && selectedAdmin) {
            // Pre-fill form data if in edit mode
            setFormData({
                name: selectedAdmin.name,
                email: selectedAdmin.email,
                password: '',
                cpassword: '',
                tel: selectedAdmin.tel || '',
                city: selectedAdmin.city || '',
                address: selectedAdmin.address || '',
                zip: selectedAdmin.zip || '',
            });

        }
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword, tel, city, address, zip } = formData;
        const body = {
            name,
            email,
            password,
            password_confirmation: cpassword,
            tel,
            city,
            address,
            zip,
        };
        try {
            if (editMode && selectedAdmin) {
                // Update existing admin
                const resp = await axios.post(`/admins/update/${selectedAdmin._id}`, body);
                if (resp.status === 200) {
                    fetchAdmins();
                    setFormData({ name: '', email: '', password: '', cpassword: '', tel: '', city: '', address: '', zip: '' });                    setAlertMessage("Admin mis à jour avec succès.");
                    setTimeout(() => {
                        setAlertMessage('');
                    }, 3000);
                }
            } else {
                // Create new admin
                const resp = await axios.post('/admins/create', { ...body, role: '1' });
                if (resp.status === 200) {
                    fetchAdmins();
                    setAlertMessage("Admin créé avec succès.");
                    setFormData({ name: '', email: '', password: '', cpassword: '', tel: '', city: '', address: '', zip: '' });                    setTimeout(() => {
                        setAlertMessage('');
                    }, 3000);
                }
            }
            setIsModalOpen(false); // Close modal after successful submission
        } catch (error) {
            if (error.response.status === 422) {
                const errors = error.response.data.errors;
                setNameError(errors.name ? errors.name[0] : '');
                setEmailError(errors.email ? errors.email[0] : '');
                setTelError(errors.tel ? errors.tel[0] : '');
                setCityError(errors.city ? errors.city[0] : '');
                setAddressError(errors.address ? errors.address[0] : '');
                setZipError(errors.zip ? errors.zip[0] : '');
                setPasswordError(errors.password ? errors.password[0] : '');
            }
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleBlock = async (_id) => {
        try {

            Swal.fire({
                title: "Êtes-vous sûre?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, Bloquer!"
              }).then((result) => {
                if (result.isConfirmed) {
                  axios.put(`/admins/block/${_id}`);
                  fetchAdmins();
                  setAlertMessage("Admin blocké avec succès.");
                  setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
                }
                fetchAdmins();
              });
            // setAdmins([...admins, resp.data.admin]);
        } catch (error) {
            console.error('Error blocking admin:', error);
        }
    };


    const handleUnBlock = async (_id) => {
        try {

            Swal.fire({
                title: "Êtes-vous sûre?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, Débloquer!"
              }).then((result) => {
                if (result.isConfirmed) {
                  axios.put(`/admins/unblock/${_id}`);
                  fetchAdmins();
                  setAlertMessage("Admin débloqué avec succès.");
                  setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
                }
                fetchAdmins();
              });
        } catch (error) {
            console.error('Error Unblocking admin:', error);
        }
    };

    const columns = [
        {
            name: 'ID',
            selector: (row) => row._id,
            sortable: true,
        },
        {
            name: 'Nom',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Modifier
                    </button>




                    {(() => {
        if (row.blocked==false){
            return (
                <button
                onClick={() => handleBlock(row._id)}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Bloquer
              </button>
            )
        }
        else
            return (

                <button
                onClick={() => handleUnBlock(row._id)}
                className="text-green-600 hover:text-green-800 flex items-center"
              >
                <FontAwesomeIcon icon={faLockOpen} className="mr-2" />
                Débloquer
              </button>
              )

      })()}

                </div>
            ),
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                border: 'none',
            },
        },
        headCells: {
            style: {
                color: '#202124',
                fontSize: '14px',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                minHeight: '56px',
            },
            highlightOnHoverStyle: {
                backgroundColor: 'rgb(230, 244, 244)',
                borderBottomColor: '#FFFFFF',
                borderRadius: '25px',
                outline: '1px solid #FFFFFF',
            },
        },
        pagination: {
            style: {
                border: 'none',
            },
        },
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
                onClose={() => setIsModalOpen(false)}
                title={editMode ? "Modifier Admin" : "Ajouter Admin"}
                onSubmit={handleSubmit}
                footer={(
                    <>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {editMode ? 'Modifier' : 'Ajouter'}
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
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nom
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {nameError && <p className="text-sm text-red-600">{nameError}</p>}
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
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {emailError && <p className="text-sm text-red-600">{emailError}</p>}
                </div>
                <div>
    <label htmlFor="tel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Téléphone
    </label>
    <input
        type="text"
        name="tel"
        id="tel"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        placeholder="12345678"
        value={formData.tel}
        onChange={handleChange}
        required
    />
    {telError && <p className="text-sm text-red-600">{telError}</p>}
</div>
<div className="mb-4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Sélectionner une ville</option>
                        {tunisianCities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                    {cityError && <p className="text-red-500 text-xs mt-1">{cityError}</p>}
                </div>
<div>
    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Adresse
    </label>
    <input
        type="text"
        name="address"
        id="address"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        placeholder="123 Rue Exemple"
        value={formData.address}
        onChange={handleChange}
        required
    />
    {addressError && <p className="text-sm text-red-600">{addressError}</p>}
</div>
<div>
    <label htmlFor="zip" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Code Postal
    </label>
    <input
        type="text"
        name="zip"
        id="zip"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        placeholder="75001"
        value={formData.zip}
        onChange={handleChange}
        required
    />
    {zipError && <p className="text-sm text-red-600">{zipError}</p>}
</div>

                <div>
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                </div>
                <div>
                    <label
                        htmlFor="cpassword"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Confirmer mot de passe
                    </label>
                    <input
                        type="password"
                        name="cpassword"
                        id="cpassword"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={formData.cpassword}
                        onChange={handleChange}
                    />
                </div>
            </Modal>
            <div className="flex justify-between items-center mt-8 mb-4">
            <h1 className="text-3xl font-bold">Gestion des Admins</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(true)}
            >
                Ajouter Admin
            </button>
</div>
            <DataTable
                columns={columns}
                data={admins}
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                pagination
                responsive
                progressPending={pending}
            />
        </>
    );
}

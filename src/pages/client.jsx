import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from 'react-data-table-component';
import Modal from '../components/CreateModal';
import axios from '../axios';

export default function Client() {
    const { client, setClient } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', cpassword: '' });
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [clients, setClients] = useState([]); // State to store clients
    const [pending, setPending] = useState(true);
    const [alertMessage, setAlertMessage] = useState(''); // State to store alert message

    const fetchClients = async () => {
        try {
            const response = await axios.get('/clients');
            setClients(response.data.clients);
            console.log(response.data.clients);
            setPending(false);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        // Reset form data and errors when modal opens or closes
        if (!isModalOpen) {
            setFormData({ name: '', email: '', password: '', cpassword: '' });
            setNameError('');
            setEmailError('');
            setPasswordError('');
        }
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = formData;
        const body = {
            name,
            email,
            password,
            password_confirmation: cpassword,
            role: '2'
        };
        try {
            const resp = await axios.post('/CreateUser', body);
            if (resp.status === 200) {
                fetchClients();
                setAlertMessage(resp.data.message); // Set alert message from the response
                setIsModalOpen(false); // Close modal after successful submission

                // Set a timeout to clear the alert message after 3 seconds
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    setNameError(errors.name ? errors.name[0] : '');
                    setEmailError(errors.email ? errors.email[0] : '');
                    setPasswordError(errors.password ? errors.password[0] : '');
                }
            } else {
                console.error('Error creating user:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const modalFooter = (
        <>
            <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Create
            </button>
            <button
                type="button"
                className="ml-3 bg-gray-100 transition duration-150 ease-in-out text-gray-600 hover:border-gray-400 hover:bg-gray-300 border rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:border-gray-500"
                onClick={() => setIsModalOpen(false)}
            >
                Cancel
            </button>
        </>
    );

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
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p className="font-bold">{alertMessage}</p>
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter Client"
                onSubmit={handleSubmit}
                footer={modalFooter}
            >
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Name
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
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                </div>
                <div>
                    <label
                        htmlFor="cpassword"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Confirm password
                    </label>
                    <input
                        type="password"
                        name="cpassword"
                        id="cpassword"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={formData.cpassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            </Modal>

            <button
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center light:bg-blue-600 light:hover:bg-blue-700 light:focus:ring-blue-800 mb-4"
                onClick={() => setIsModalOpen(true)}
            >
                Ajouter Client
            </button>

            <DataTable
                title="Clients"
                columns={columns}
                data={clients}
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

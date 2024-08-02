import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from 'react-data-table-component';
import Modal from '../components/CreateModal';
import axios from '../axios';

export default function Admin() {
    const { admin, setAdmin } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', cpassword: '' });
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [admins, setAdmins] = useState([]); // State to store admins
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('/admins');
                setAdmins(response.data.admins);
                setPending(false);
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };
        fetchAdmins();
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
            role: '1',
        };
        try {
            const resp = await axios.post('/CreateUser', body);
            if (resp.status === 200) {
                setAdmin(resp.data.admin);
                console.log(resp.data.admin);
                setIsModalOpen(false); // Close modal after successful submission
            }
        } catch (error) {
            if (error.response.status === 422) {
                const errors = error.response.data.errors;
                setNameError(errors.name ? errors.name[0] : '');
                setEmailError(errors.email ? errors.email[0] : '');
                setPasswordError(errors.password ? errors.password[0] : '');
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter Admin"
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
                Ajouter Admin
            </button>

            <DataTable
                title="Admins"
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

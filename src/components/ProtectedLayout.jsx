import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from '../contexts/AuthContext';

export default function DefaultLayout() {
    const { user, setUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);

    // check if user is logged in or not from server
    useEffect(() => {
        console.log('Current user state:', user);

        (async () => {
            try {
                const resp = await axios.get('/user');
                if (resp.status === 200) {
                    setUser(resp.data.data);
                }
            } catch (error) {
                if (error.response.status === 401) {
                    localStorage.removeItem('user');
                    window.location.href = '/';
                }
            }
        })();
    }, []);

    // if user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/" />;
    }

    // logout user
    const handleLogout = async () => {
        try {
            const resp = await axios.post('/logout');
            if (resp.status === 200) {
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <nav className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-xl z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 bg-blue-900">
                        <a href="https://dcodemania.com/" className="flex items-center">
                            <img src="https://dcodemania.com/img/logo.svg" className="h-8 mr-3" alt="DCodeMania Logo" />
                            <span className="text-2xl font-bold">DCodeMania</span>
                        </a>
                        <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <ul className="mt-4 flex-1 px-2 space-y-2">
                    <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-blue-700 rounded-lg shadow-lg' : 'block py-3 px-4 text-gray-200 hover:bg-blue-700 hover:shadow-lg rounded-lg'}>
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <div className="relative">
                                <button
                                    onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                                    className="flex justify-between items-center w-full text-left py-3 px-4 text-gray-200 hover:bg-blue-700 hover:shadow-lg rounded-lg"
                                >
                                    Users
                                    <svg
                                        className={`w-4 h-4 ml-2 transition-transform ${usersDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {usersDropdownOpen && (
                                    <ul className="absolute left-0 w-full bg-white text-blue-600 rounded-lg shadow-lg z-10">
                                        <li>
                                            <NavLink to="/clients" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-blue-700 rounded-lg shadow-lg text-white' : 'block py-3 px-4 text-blue-600 hover:bg-blue-500 hover:shadow-lg rounded-lg'}>
                                                Clients
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admins" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-blue-700 rounded-lg shadow-lg text-white' : 'block py-3 px-4 text-blue-600 hover:bg-blue-500 hover:shadow-lg rounded-lg'}>
                                                Admins
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </li>
                        <li>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-blue-700 rounded-lg shadow-lg' : 'block py-3 px-4 text-gray-200 hover:bg-blue-700 hover:shadow-lg rounded-lg'}>
                                Profil
                            </NavLink>
                        </li>
                        <li>
                            <a onClick={handleLogout} href="#" className="block py-3 px-4 text-gray-200 hover:bg-blue-700 hover:shadow-lg rounded-lg">
                                Logout
                            </a>
                        </li>
                    </ul>
                    <div className="p-4">
                        <a href="https://github.com/dcodemania" target="_blank" rel="noopener noreferrer" className="block py-3 px-4 text-center text-blue-900 bg-white rounded-lg shadow-lg hover:bg-gray-100">
                            <span className="font-bold">GitHub</span>
                        </a>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <header className="bg-white shadow-md p-4 flex items-center justify-between">
                    <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                    <div>
                        <a href="https://dcodemania.com/" className="text-xl font-bold text-gray-800">DCodeMania</a>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

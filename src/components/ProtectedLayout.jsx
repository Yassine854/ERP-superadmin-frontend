import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from '../contexts/AuthContext';

export default function DefaultLayout() {
    const { user, setUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdowns, setDropdowns] = useState({
        users: false,
        offers: false,
        settings: false,
    });

    useEffect(() => {
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

    if (!user) {
        return <Navigate to="/" />;
    }

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

    const toggleDropdown = (name) => {
        setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <nav className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-gray-200 shadow-md z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 bg-gray-700">
                        <a href="#" className="text-xl font-semibold">Super Admin</a>
                        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <ul className="mt-4 flex-1 px-2 space-y-2">
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-700 rounded-lg' : 'block py-3 px-4 hover:bg-gray-700 rounded-lg'}>
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-700 rounded-lg' : 'block py-3 px-4 hover:bg-gray-700 rounded-lg'}>
                                Profile
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/packs" className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-700 rounded-lg' : 'block py-3 px-4 hover:bg-gray-700 rounded-lg'}>
                                Packs et Offres
                            </NavLink>
                        </li>

                        <li>
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('users')}
                                    className="flex justify-between items-center w-full text-left py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg"
                                >
                                    Admins d'entreprise
                                    <svg
                                        className={`w-4 h-4 ml-2 transition-transform duration-300 ${dropdowns.users ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {dropdowns.users && (
                                    <ul className="absolute left-0 w-full bg-gray-700 text-gray-200 rounded-lg shadow-lg z-10 mt-1">
                                        <li>
                                            <NavLink
                                                to="/admins"
                                                className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-800 text-gray-200 rounded-lg' : 'block py-3 px-4 hover:bg-gray-800 rounded-lg'}
                                            >
                                                Admins
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/roles"
                                                className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-800 text-gray-200 rounded-lg' : 'block py-3 px-4 hover:bg-gray-800 rounded-lg'}
                                            >
                                                Roles
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </li>

                        <li>
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('settings')}
                                    className="flex justify-between items-center w-full text-left py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg"
                                >
                                    Site Settings
                                    <svg
                                        className={`w-4 h-4 ml-2 transition-transform duration-300 ${dropdowns.settings ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {dropdowns.settings && (
                                    <ul className="absolute left-0 w-full bg-gray-700 text-gray-200 rounded-lg shadow-lg z-10 mt-1">
                                        <li>
                                            <NavLink
                                                to="/sliders/admins"
                                                className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-800 text-gray-200 rounded-lg' : 'block py-3 px-4 hover:bg-gray-800 rounded-lg'}
                                            >
                                                Slides
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/parametres/admins"
                                                className={({ isActive }) => isActive ? 'block py-3 px-4 bg-gray-800 text-gray-200 rounded-lg' : 'block py-3 px-4 hover:bg-gray-800 rounded-lg'}
                                            >
                                                Parameters
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </li>
                    </ul>
                    <div className="p-4">
                        <a href="#" onClick={handleLogout} className="block py-3 px-4 text-center text-gray-800 bg-gray-300 rounded-lg hover:bg-gray-400">
                            <span className="font-bold">Déconnexion</span>
                        </a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
                    <button className="text-gray-800" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

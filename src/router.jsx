import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Client from './pages/client';
import Admin from './pages/admin';
import Dashboard from './pages/dashboard';


import Register from './pages/Register';
import ProtectedLayout from './components/ProtectedLayout';
import GuestLayout from './components/GuestLayout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <GuestLayout />,
		children: [
			{
				path: '/',
				element: <Login />,
			},
			{
				path: '/register',
				element: <Register />,
			},
		],
	},
	{
		path: '/',
		element: <ProtectedLayout />,
		children: [
            {
				path: '/dashboard',
				element: <Dashboard />,
			},
			{
				path: '/profile',
				element: <Profile />,
			},
            {
				path: '/clients',
				element: <Client />,
			},
            {
				path: '/admins',
				element: <Admin />,
			},
		],
	},
]);

export default router;

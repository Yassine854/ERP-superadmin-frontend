import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Client from './pages/client';
import Admin from './pages/admin';
import Dashboard from './pages/dashboard';
import Role from './pages/role';
import Admin_Sliders from './pages/slider/admin';
import Slide from './pages/slider/slide';
import Pack from './pages/pack';
import Offre from './pages/offre';

import Admin_Parametres from './pages/parametre/admin';
import Parametre from './pages/parametre/parametre';

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
            {
				path: '/roles',
				element: <Role />,
			},
            {
				path: '/sliders/admins',
				element: <Admin_Sliders />,
			},
            {
				path: '/sliders/:id',
				element: <Slide />,
			},
            {
				path: '/packs',
				element: <Pack />,
			},
            {
				path: '/offres',
				element: <Offre />,
			},
            {
				path: '/parametres/admins',
				element: <Admin_Parametres />,
			},
            {
				path: '/parametres/:id',
				element: <Parametre />,
			},
		],
	},
]);

export default router;

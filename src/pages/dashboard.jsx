import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
	const { user } = useAuth();
	return (
		<>
			<div className="text-6xl font-bold text-slate-600">Dashboard</div>
			<hr className="bg-slate-400 h-1 w-full my-4" />
			<div className="block p-10 bg-white border border-gray-200 shadow-xl rounded-lg shadowdark:border-gray-700">

			</div>
		</>
	);
}
    
import { createContext, useContext, useState } from 'react';
import axios from '../axios';

const AuthContent = createContext({
	user: null,
	setUser: () => {},
	csrfToken: () => {},
});

export const AuthProvider = ({ children }) => {
	const [user, _setUser] = useState(
		JSON.parse(localStorage.getItem('user')) || null
	);

	// set user to local storage
	const setUser = (user) => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
		_setUser(user);
	};

	// csrf token generation for guest methods
	const csrfToken = async () => {
        try {
            await axios.get('https://example.shop/api/csrf-cookie');
            console.log('CSRF token fetched successfully');
            return true;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
            return false;
        }
    };

	return (
		<AuthContent.Provider value={{ user, setUser, csrfToken }}>
			{children}
		</AuthContent.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContent);
};

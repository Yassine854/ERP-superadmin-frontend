import Axios from 'axios';

// Function to get the base URL based on the stored user subdomain
const getBaseURL = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.subdomain
        ? `https://${user.subdomain}.example.shop/api`
        : "https://example.shop/api";
};

// Create an Axios instance
const axios = Axios.create({
    baseURL: getBaseURL(), // Use the dynamic base URL function
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Add a request interceptor to update the base URL dynamically
axios.interceptors.request.use(
    (config) => {
        // Update baseURL before sending the request
        config.baseURL = getBaseURL();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;

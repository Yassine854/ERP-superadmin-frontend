import Axios from 'axios';

const axios = Axios.create({
	baseURL: "https://example.shop/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
        'X-Requested-With': 'XMLHttpRequest',
	},
});

export default axios;

import axios, { AxiosRequestConfig } from 'axios';

function getBaseUrl() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	if (!baseUrl) {
		console.error(
			'NEXT_PUBLIC_BASE_URL not available in environment, setting default localhost'
		);
		return 'http://localhost:3333';
	}
	console.log(`using base url provided: ${baseUrl}`);
	return baseUrl;
}

const BASE_URL = getBaseUrl();

const axiosConfig: AxiosRequestConfig<void> = {
	baseURL: `${BASE_URL}/api`,
};

const api = axios.create(axiosConfig);

export default api;

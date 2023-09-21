import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333';

const axiosConfig: AxiosRequestConfig<void> = {
	baseURL: `${BASE_URL}/api`,
};

const api = axios.create(axiosConfig);

export default api;

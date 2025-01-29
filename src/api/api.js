import axios from 'axios';
import qs from 'qs';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: (params) => qs.stringify(params, { skipNulls: true }),
  headers: { Accept: 'application/json' },
  timeout: 0
});

api.interceptors.request.use((request) => {
  const session = localStorage.getItem('RBsession');

  if (session) {
    const { token } = JSON.parse(session);
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

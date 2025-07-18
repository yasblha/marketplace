// services/api.ts
import axios from 'axios';
import { apiUrl } from '@/utils/backend';

const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Récupération du token depuis le stockage local au format correct
        const authData = localStorage.getItem('auth');
        let token = null;
        
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                token = parsed.token;
                console.log('[Axios Interceptor] Token trouvé:', !!token);
            } catch (e) {
                console.error('Erreur lors de la lecture du token:', e);
            }
        } else {
            console.log('[Axios Interceptor] Pas de données auth dans localStorage');
        }
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('[Axios Interceptor] Authorization header ajouté');
            console.log('[Axios Interceptor] URL appelée:', config.url);
        } else {
            console.log('[Axios Interceptor] Requête sans token:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.log('[Axios Interceptor] Erreur 401 détectée, détails:', {
                url: error.config.url,
                method: error.config.method,
                hasAuthHeader: !!error.config.headers['Authorization']
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

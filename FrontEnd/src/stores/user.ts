import { ref, computed, watch, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import router from "@/router/router";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface RegisterData {
    role: string;
    email: string;
    lastName: string;
    firstName: string;
    password: string;
    password_confirm: string;
    newsletter: boolean; 
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);

    const isAuthenticated = computed(() => !!user.value);
    console.log('Initial isAuthenticated:', isAuthenticated.value);

    const persistState = () => {
        console.log('Persisting state to localStorage');
        localStorage.setItem('auth', JSON.stringify({
            user: user.value,
            token: token.value,
        }));
        // Utilisation de cookies pour le refresh token
        if (refreshToken.value) {
            document.cookie = `refreshToken=${refreshToken.value}; path=/; Secure; SameSite=Strict`;
        }
    };

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const loadState = () => {
        console.log('Loading state from localStorage');
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            const { user: storedUser, token: storedToken } = JSON.parse(storedAuth);
            user.value = storedUser;
            token.value = storedToken;
            // Charger le refresh token depuis les cookies
            refreshToken.value = getCookie('refreshToken');
            console.log('Loaded user:', user.value);
            console.log('Loaded token:', token.value);
            console.log('Loaded refresh token:', refreshToken.value);
            if (token.value) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            }
        }
    };

    watch(
        () => ({ user: user.value, token: token.value, refreshToken: refreshToken.value }),
        persistState,
        { deep: true }
    );

    async function register(userData: RegisterData) {
        try {
            console.log('Registering user:', userData);
            const response = await axiosInstance.post('auth/register', userData);
            console.log('Register response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    }    

    async function login(email: string, password: string) {
        try {
            console.log('Logging in with email:', email);
            const response = await axiosInstance.post('auth/login', { email, password });
            console.log('Login response:', response.data);
            user.value = response.data.user;
            token.value = response.data.accessToken;
            refreshToken.value = response.data.refreshToken;
            console.log('Setting user:', user.value);
            console.log('Setting token:', token.value);
            console.log('Setting refresh token:', refreshToken.value);
            if (token.value) {
                localStorage.setItem('authToken', token.value);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            }
            startRefreshTokenTimer();
            return response.data;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    async function refreshTokenFunc() {
        if (refreshToken.value) {
            try {
                const response = await axiosInstance.post('auth/refresh-token', { refreshToken: refreshToken.value });
                token.value = response.data.accessToken;
                refreshToken.value = response.data.refreshToken;
                console.log('Refreshed token:', token.value);
                console.log('Refreshed refresh token:', refreshToken.value);
                if (token.value) {
                    localStorage.setItem('authToken', token.value);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
                }
                // Mettre à jour le cookie avec le nouveau refresh token
                document.cookie = `refreshToken=${refreshToken.value}; path=/; Secure; SameSite=Strict`;
            } catch (error) {
                console.error('Erreur de rafraîchissement du token:', error);
                logout();
            }
        } else {
            console.error('No refresh token available for refreshing');
        }
    }

    let refreshTokenInterval: number | null = null;

    function startRefreshTokenTimer() {
        if (refreshTokenInterval) {
            clearInterval(refreshTokenInterval);
        }
        refreshTokenInterval = window.setInterval(refreshTokenFunc, 14 * 60 * 1000);
    }

    async function logout() {
        if (token.value) {
            try {
                await axiosInstance.post('auth/logout', { token: token.value }, {
                    headers: {
                        'Authorization': `Bearer ${token.value}`
                    }
                });
            } catch (error) {
                console.error('Erreur de déconnexion:', error);
            } finally {
                console.log('Logging out user');
                user.value = null;
                token.value = null;
                refreshToken.value = null;
                localStorage.removeItem('authToken');
                localStorage.removeItem('auth');
                // Supprimer les cookies
                document.cookie = 'refreshToken=; Max-Age=0; path=/;';
                delete axiosInstance.defaults.headers.common['Authorization'];
                router.push('/');
                if (refreshTokenInterval) {
                    clearInterval(refreshTokenInterval);
                }
            }
        }
    }

    async function requestPasswordReset(email: string) {
        try {
            console.log('Requesting password reset for email:', email);
            const response = await axiosInstance.post('auth/forgot-password', { email });
            console.log('Password reset request response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur de demande de réinitialisation de mot de passe:', error);
            throw error;
        }
    }

    async function resetPassword(token: string, newPassword: string, newPasswordConfirm: string) {
        try {
            console.log('Resetting password with token:', token);
            const response = await axiosInstance.post('auth/reset-password', { token, newPassword, newPasswordConfirm });
            console.log('Password reset response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur de réinitialisation de mot de passe:', error);
            throw error;
        }
    }

    async function fetchUser() {
        try {
            console.log('Fetching user data');
            const response = await axiosInstance.get('auth/me');
            user.value = response.data;
            console.log('Fetched user data:', user.value);
        } catch (error) {
            console.error('Erreur de récupération des données utilisateur:', error);
            throw error;
        }
    }

    loadState();

    watchEffect(() => {
        console.log('Auth state changed, isAuthenticated:', isAuthenticated.value);
        if (isAuthenticated.value) {
            startRefreshTokenTimer();
        }
    });

    return {
        user,
        token,
        refreshToken,
        isAuthenticated,
        register,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        refreshTokenFunc,
        fetchUser,
    };
});

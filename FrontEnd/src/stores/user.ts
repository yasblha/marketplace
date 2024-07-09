import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import router from "@/router/router";

interface User {
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
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    const isAuthenticated = computed(() => !!user.value);

    // Abonnement pour persister l'état dans localStorage
    const persistState = () => {
        localStorage.setItem('auth', JSON.stringify({
            user: user.value,
            token: token.value
        }));
    };

    watch(
        () => ({ user: user.value, token: token.value }),
        persistState,
        { deep: true }
    );

    async function register(userData: RegisterData) {
        try {
            const response = await axiosInstance.post('auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    }

    async function login(email: string, password: string) {
        try {
            const response = await axiosInstance.post('auth/login', { email, password });
            user.value = response.data.user;
            token.value = response.data.token;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            return response.data;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    function logout() {
        return axiosInstance.post('auth/logout').then(() => {
            user.value = null;
            token.value = null;
            delete axiosInstance.defaults.headers.common['Authorization'];
            localStorage.removeItem('auth');
            router.push('/login');
        });
    }

    async function requestPasswordReset(email: string) {
        try {
            const response = await axiosInstance.post('auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Erreur de demande de réinitialisation de mot de passe:', error);
            throw error;
        }
    }

    async function resetPassword(token: string, newPassword: string, newPasswordConfirm: string) {
        try {
            const response = await axiosInstance.post('auth/reset-password', { token, newPassword, newPasswordConfirm });
            return response.data;
        } catch (error) {
            console.error('Erreur de réinitialisation de mot de passe:', error);
            throw error;
        }
    }

    async function refreshToken() {
        try {
            const response = await axiosInstance.post('auth/refresh-token');
            token.value = response.data.token;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
        } catch (error) {
            console.error('Erreur de rafraîchissement du token:', error);
            logout();
        }
    }

    async function fetchUser() {
        try {
            const response = await axiosInstance.get('auth/me');
            user.value = response.data;
        } catch (error) {
            console.error('Erreur de récupération des données utilisateur:', error);
            throw error;
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        register,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        refreshToken,
        fetchUser,
    };
});

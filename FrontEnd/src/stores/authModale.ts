import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthModalStore = defineStore('authModal', () => {
    const isVisible = ref(false);
    const mode = ref<'login' | 'register'>('login');

    function openModal(m: 'login' | 'register' = 'login') {
        mode.value = m;
        isVisible.value = true;
    }

    function closeModal() {
        isVisible.value = false;
    }

    return {
        isVisible,
        mode,
        openModal,
        closeModal
    };
});

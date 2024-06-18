// src/router/router.ts
import { createRouter, createWebHistory } from 'vue-router';

import Register from '../pages/Register.vue';
import Login from "../pages/Login.vue";


const routes = [
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

// src/router/router.ts
import { createRouter, createWebHistory } from 'vue-router';

import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Products from '../pages/Products.vue';

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
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/products',
        name: 'Products',
        component: Products
    }
    

];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

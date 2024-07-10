// src/router/router.ts
import { createRouter, createWebHistory } from 'vue-router';

import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import Home from "@/pages/Home.vue";
import Products from "@/pages/Products.vue";
import ForgotPassword from "@/pages/ForgotPassword.vue";
import ConfirmEmail from "@/pages/ConfirmEmail.vue";
import resetPassword from '@/pages/resetPassword.vue';
import adminDashboard from "@/pages/admin_dashboard.vue";
import NotFound from "@/pages/NotFound.vue";


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
    },
    {
        path: '/forgot-password',
        name:'ForgotPassword',
        component: ForgotPassword
    },
    {
        path: '/confirm-email/:token',
        name:'ConfirmEmail',
        component: ConfirmEmail
    },
    {
        path: '/',
        redirect:'/home',
    },
    {
        path: '/reset-password/:resetToken',
        name: 'reset-password',
        component: resetPassword
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/dashboard',
        name: 'adminDashboard',
        component: adminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true } ,
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

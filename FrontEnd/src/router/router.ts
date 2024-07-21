// src/router/router.ts
import { createRouter, createWebHistory } from 'vue-router';

import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Products from '../pages/Products.vue';
import OneProduct from '../pages/OneProduct.vue';
import Panier from '../pages/Panier.vue';
import Favorites from '../pages/Favorites.vue';
import Success from '../pages/PaymentSucces.vue';
import Cancel from '../pages/PaymentCancel.vue';



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
        path: '/product/:id',
        name: 'OneProduct',
        component: OneProduct,
        props: true

    },
    {
        path: '/panier',
        name: 'Panier',
        component: Panier
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites
    },
    {
        path: '/success',
        name: 'Success',
        component: Success
    },
    {
        path: '/cancel',
        name: 'Cancel',
        component: Cancel
    }

];


const router = createRouter({
    history: createWebHistory(),
    routes
  });

export default router;
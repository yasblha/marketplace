<template>
    <nav class="navbar">
        <div class="title">
            <a class="navbar-brand" href="/home">Bandage</a>
        </div>

        <div class="links">

            <li class="nav-item"><a class="nav-link" href="/home">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/products">Shop</a></li>
            <li class="nav-item"><a class="nav-link" href="/about">About</a></li>
            <li class="nav-item"><a class="nav-link" href="/blog">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="/contact">Contact</a></li>
            <li class="nav-item"><a class="nav-link" href="/contact">Pages</a></li>


        </div>

        <ul class="linkTwo">
            <li class="nav-item"><a class="nav-link2" href="/login">Login/Register</a></li>
            <li class="nav-item"><a class="nav-link2" href="/login"><img src="../../assets/Vector.svg"></img></a></li>
            <li class="nav-item"><a class="nav-link2" href="/login"><img src="../../assets/Panier.svg"></img></a></li>
            <li class="nav-item"><a class="nav-link2" href="/login"><img src="../../assets/hart.svg"></img></a></li>
        </ul>



    </nav>
</template>

<script>
import { ref } from 'vue';
export default {
    name: 'NavigationBar'

};
</script>

<style scoped>
.navbar {
    display: flex;
    /* justify-content: space-between; */
    width: 100%;
    background-color: white;
    /* padding: 10px 20px; */
    color: black;
    PADDING: 19px;
}

.title {

    margin: auto;
    font-size: 20px;
}


.links {
    display: flex;
    text-decoration: none;
    list-style: none;
    color: black;
    margin: auto;
}

.title a {
    color: rgba(37, 43, 66, 1);
    font-weight: 700;
}

.links li {
    margin-left: 18px;
}

.linkTwo {
    display: flex;
    margin: auto;
}


.linkTwo li {
    list-style: none;
    margin-left: 14px;
}

.links li a {
    color: rgba(115, 115, 115, 1);
}

.linkTwo li a {
    color: #23a6f0;
    font-weight: 500;

}

/* .navbar-brand {
    color: black;
    text-decoration: none;
    font-size: 1.5em;
} */
</style>

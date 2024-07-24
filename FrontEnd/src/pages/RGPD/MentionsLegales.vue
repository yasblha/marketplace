<template>
    <section class="mentions-legales">
      <div class="content">
        <div class="header">
          <h1>Mentions Légales</h1>
        </div>
        <div class="section">
          <h2>1. Présentation du site</h2>
          <p>
            Le site <strong>MAMBAFIT</strong> est un site de vente d’équipements sportifs en ligne accessible à l’adresse suivante : <a href="https://www.mambafit.fr" target="_blank" rel="noopener noreferrer">www.mambafit.fr</a>.
          </p>
          <p>
            Éditeur du site : <strong>MAMBAFIT</strong><br>
            Adresse : 10 Rue de la Santé, 75013 Paris, France<br>
            Téléphone : +33 1 23 45 67 89<br>
            Email : <a href="mailto:contact@mambafit.fr">contact@mambafit.fr</a>
          </p>
          <p>
            Directeur de la publication : <strong>Jean Dupont</strong>
          </p>
          <p>
            Hébergeur : <strong>OVH</strong><br>
            Adresse : 2 Rue Kellermann, 59100 Roubaix, France<br>
            Téléphone : +33 9 70 80 90 11
          </p>
        </div>
        <div class="section">
          <h2>2. Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur le site MAMBAFIT (textes, images, logos, etc.) sont protégés par les lois en vigueur sur la propriété intellectuelle. Toute reproduction, distribution, ou utilisation de ces contenus sans l’autorisation expresse de MAMBAFIT est interdite.
          </p>
        </div>
        <div class="section">
          <h2>3. Données personnelles et RGPD</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), MAMBAFIT s'engage à protéger vos données personnelles. Les informations collectées sur le site sont utilisées uniquement pour le traitement de vos commandes et pour vous tenir informé(e) de nos offres.
          </p>
          <p>
            <strong>Responsable du traitement des données :</strong> MAMBAFIT<br>
            <strong>Adresse :</strong> 10 Rue de la Santé, 75013 Paris, France<br>
            <strong>Email :</strong> <a href="mailto:contact@mambafit.fr">contact@mambafit.fr</a>
          </p>
          <p>
            Vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul>
            <li>Droit d'accès</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez nous contacter à l'adresse mentionnée ci-dessus.
          </p>
        </div>
        <div class="section">
          <h2>4. Cookies</h2>
          <p>
            Le site MAMBAFIT utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont des fichiers stockés sur votre appareil et qui permettent d'analyser votre utilisation du site.
          </p>
          <p>
            Vous pouvez à tout moment désactiver les cookies en configurant les paramètres de votre navigateur.
          </p>
        </div>
        <div class="section">
          <h2>5. Limitation de responsabilité</h2>
          <p>
            MAMBAFIT s'efforce de fournir des informations exactes et à jour sur le site, mais ne saurait être tenue responsable des erreurs ou omissions pouvant survenir. L’utilisateur utilise le site à ses propres risques.
          </p>
        </div>
        <div class="section">
          <h2>6. Modification des mentions légales</h2>
          <p>
            MAMBAFIT se réserve le droit de modifier les présentes mentions légales à tout moment. Les modifications seront publiées sur cette page et entreront en vigueur immédiatement.
          </p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  </script>
  
  <style scoped>
  .mentions-legales {
    font-family: 'Arial', sans-serif;
    margin: 20px auto;
    padding: 20px;
    max-width: 800px;
    background-color: #f9f9f9;
    color: #333;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .header h1 {
    font-size: 32px;
    color: #007bff;
    margin-bottom: 10px;
  }
  
  .header a {
    color: #007bff;
    text-decoration: none;
  }
  
  .header a:hover {
    text-decoration: underline;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #343a40; /* Dark gray color */
    border-bottom: 2px solid #007bff; /* Blue underline */
    padding-bottom: 5px;
  }
  
  .section p {
    font-size: 16px;
    line-height: 1.7;
    margin-top: 10px;
    color: #555;
  }
  
  .section ul {
    list-style-type: disc;
    margin-left: 20px;
    margin-top: 10px;
  }
  
  .section li {
    margin-bottom: 10px;
  }
  
  .section a {
    color: #007bff;
    text-decoration: none;
  }
  
  .section a:hover {
    text-decoration: underline;
  }
  </style>
  
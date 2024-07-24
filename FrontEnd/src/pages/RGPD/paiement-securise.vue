<template>
    <section class="paiement-securise">
      <div class="content">
        <div class="header">
          <h1>Paiement Sécurisé</h1>
        </div>
        <div class="section">
          <h2>1. Introduction</h2>
          <p>
            Le site <strong>MAMBAFIT</strong> utilise Stripe pour traiter vos paiements en ligne de manière sécurisée. Stripe est un prestataire de services de paiement reconnu, offrant des solutions sécurisées pour les transactions en ligne.
          </p>
        </div>
        <div class="section">
          <h2>2. Sécurité des Paiements</h2>
          <p>
            Nous prenons la sécurité de vos transactions très au sérieux. Lorsque vous effectuez un paiement sur notre site, toutes les informations sont transmises en utilisant le protocole HTTPS, garantissant que les données sont cryptées et protégées contre les interceptions.
          </p>
          <p>
            Stripe utilise des technologies de pointe pour protéger vos informations financières. Vos informations de paiement ne sont jamais stockées sur nos serveurs. Elles sont directement envoyées à Stripe, où elles sont traitées en toute sécurité.
          </p>
        </div>
        <div class="section">
          <h2>3. Conformité au RGPD</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), MAMBAFIT s'engage à protéger vos données personnelles. Les informations liées aux paiements sont traitées avec la plus grande confidentialité et uniquement pour le traitement des transactions.
          </p>
          <p>
            <strong>Responsable du traitement des données :</strong> MAMBAFIT<br>
            <strong>Adresse :</strong> 10 Rue de la Santé, 75013 Paris, France<br>
            <strong>Email :</strong> <a href="mailto:contact@mambafit.fr">contact@mambafit.fr</a>
          </p>
          <p>
            Vous avez le droit d'accéder à vos données personnelles, de les rectifier ou de demander leur suppression en nous contactant à l'adresse ci-dessus.
          </p>
        </div>
        <div class="section">
          <h2>4. Cookies et Technologies Similaires</h2>
          <p>
            Pour assurer le bon fonctionnement des paiements en ligne, nous utilisons des cookies et des technologies similaires. Ceux-ci nous permettent de garantir la sécurité de vos transactions et d'améliorer votre expérience d'achat.
          </p>
          <p>
            Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur. Veuillez consulter notre politique de confidentialité pour plus de détails.
          </p>
        </div>
        <div class="section">
          <h2>5. Assistance et Contact</h2>
          <p>
            Si vous avez des questions ou des préoccupations concernant le processus de paiement ou la sécurité de vos informations, n'hésitez pas à nous contacter :
          </p>
          <p>
            <strong>Email :</strong> <a href="mailto:contact@mambafit.fr">contact@mambafit.fr</a><br>
            <strong>Téléphone :</strong> +33 1 23 45 67 89
          </p>
        </div>
        <div class="section">
          <h2>6. Modification de la Page</h2>
          <p>
            MAMBAFIT se réserve le droit de modifier cette page de paiement sécurisé à tout moment. Les changements seront publiés sur cette page et entreront en vigueur immédiatement.
          </p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  </script>
  
  <style scoped>
  .paiement-securise {
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
    font-size: 12px;
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
  
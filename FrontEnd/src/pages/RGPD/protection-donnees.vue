<template>
    <section class="politique-protection-donnees">
      <div class="content">
        <div class="header">
          <h1>Politique de Protection des Données</h1>
        </div>
        <div class="section">
          <h2>1. Introduction</h2>
          <p>
            La présente politique de protection des données explique comment <strong>MAMBAFIT</strong> collecte, utilise, conserve et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux autres législations en vigueur.
          </p>
        </div>
        <div class="section">
          <h2>2. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est :<br>
            <strong>MAMBAFIT</strong><br>
            Adresse : 10 Rue de la Santé, 75013 Paris, France<br>
            Téléphone : +33 1 23 45 67 89<br>
            Email : <a href="mailto:contact@mambafit.fr">contact@mambafit.fr</a>
          </p>
        </div>
        <div class="section">
          <h2>3. Données collectées</h2>
          <p>
            Nous collectons les types de données personnelles suivants :
          </p>
          <ul>
            <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail, numéro de téléphone.</li>
            <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages visitées.</li>
            <li><strong>Données transactionnelles :</strong> détails des achats, historique des commandes.</li>
          </ul>
        </div>
        <div class="section">
          <h2>4. Finalités du traitement</h2>
          <p>
            Vos données personnelles sont utilisées pour les finalités suivantes :
          </p>
          <ul>
            <li>Gestion des commandes et du service client.</li>
            <li>Amélioration des services et personnalisation des offres.</li>
            <li>Communication d'informations sur les produits et services.</li>
            <li>Respect des obligations légales et réglementaires.</li>
          </ul>
        </div>
        <div class="section">
          <h2>5. Bases légales du traitement</h2>
          <p>
            Le traitement de vos données repose sur les bases légales suivantes :
          </p>
          <ul>
            <li><strong>Consentement :</strong> Lorsque vous acceptez expressément la collecte et l'utilisation de vos données.</li>
            <li><strong>Exécution du contrat :</strong> Pour le traitement de vos commandes et la fourniture des services.</li>
            <li><strong>Obligations légales :</strong> Pour se conformer aux exigences légales.</li>
            <li><strong>Intérêts légitimes :</strong> Pour améliorer nos produits et services.</li>
          </ul>
        </div>
        <div class="section">
          <h2>6. Durée de conservation des données</h2>
          <p>
            Nous conservons vos données personnelles pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément aux exigences légales. En général, les données sont conservées pendant une période maximale de 5 ans après la dernière interaction.
          </p>
        </div>
        <div class="section">
          <h2>7. Destinataires des données</h2>
          <p>
            Vos données personnelles peuvent être partagées avec :
          </p>
          <ul>
            <li><strong>Les prestataires de services :</strong> Pour la gestion des commandes, l'hébergement du site, les services de paiement.</li>
            <li><strong>Les autorités légales :</strong> En cas de besoin pour respecter les exigences légales ou protéger nos droits.</li>
            <li><strong>Les partenaires :</strong> Avec votre consentement, pour des offres ou promotions spécifiques.</li>
          </ul>
        </div>
        <div class="section">
          <h2>8. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre les accès non autorisés, la divulgation, la modification ou la destruction. Ces mesures comprennent des protocoles de sécurité physiques, électroniques et administratifs.
          </p>
        </div>
        <div class="section">
          <h2>9. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul>
            <li><strong>Droit d'accès :</strong> Obtenir une copie des données personnelles que nous détenons sur vous.</li>
            <li><strong>Droit de rectification :</strong> Corriger les données inexactes ou incomplètes.</li>
            <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données dans certaines situations.</li>
            <li><strong>Droit à la limitation du traitement :</strong> Restreindre le traitement de vos données.</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et couramment utilisé.</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des raisons liées à votre situation particulière.</li>
          </ul>
          <p>
            Pour exercer vos droits, veuillez nous contacter à l'adresse suivante : <a href="mailto:contact@mambafit.fr">contact@mambafit.fr</a>.
          </p>
        </div>
        <div class="section">
          <h2>10. Modifications de la politique de protection des données</h2>
          <p>
            Nous pouvons modifier cette politique de protection des données à tout moment. Les modifications seront publiées sur cette page et entreront en vigueur immédiatement.
          </p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  </script>
  
  <style scoped>
  .politique-protection-donnees {
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
    color: #007bff; /* Blue color */
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
  
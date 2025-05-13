# 🛒 Marketplace E-commerce

## 📦 Description

Ce projet est une marketplace e-commerce fullstack développée dans avec (Node.js, MongoDB, PostgreSQL, VueJS, RGPD). Elle permet aux utilisateurs de rechercher, réserver, acheter et suivre des produits avec un système d’alertes, de rôles utilisateurs, de gestion de stocks et d’intégration RGPD.

> 🔐 Authentification sécurisée, 💳 paiements en ligne, 📈 dashboards admin, et 📬 alertes personnalisées.

## 🚀 Lancement du projet

### ⚙️ Pré-requis

- Docker
- Docker Compose

### 🧭 Démarrage

```bash
docker-compose up -d
```

## 🧪 Stack technique

| Côté client         | Côté serveur          | DevOps / Outils         |
|---------------------|-----------------------|--------------------------|
| Vue 3 (TypeScript)  | Node.js (Express)     | Docker, Docker Compose   |
| Vue Router / Pinia  | MongoDB + Mongoose+ PG| Git + GitLab CI          |
| Zod / composables   | JWT Auth              | Stripe API, API La Poste |
| Axios / Tailwind CSS| RESTful API           | Kubernetes (optionnel)   |

## ✅ Fonctionnalités principales

### 🔐 Authentification

- Inscription avec mail de confirmation
- Sécurité CNIL : mot de passe 12+ caractères avec symboles, chiffres, lettres
- Temporisation après 3 tentatives
- Expiration et renouvellement tous les 60 jours
- Réinitialisation par mail
- Mots de passe hachés

### 🔎 Recherche produit

- Recherche sur nom/description
- Recherche via URL GET (partageable)
- Recherche facettée : nom, catégorie, marque, prix, promo, stock

### 📧 Alertes par mail

- Nouveaux produits d’une catégorie
- Restock de produit
- Changements de prix
- Newsletter
- Préférences d’abonnement/désabonnement

### 🛒 Panier

- Réservation de produit pendant 15 minutes

### 💳 Paiement

- Intégration Stripe / PayPal
- Lien de paiement unique
- Remboursement (facture d’avoir)

### 🚚 Livraison

- Livraison La Poste
- Livraison en point relais
- Cartographie avec Google Maps + GeoJSON (MongoDB)
- Sélection de point relais via carte

### 📦 Stock

- Alerte de fin de stock
- Seuils configurables
- Graphique d’évolution des stocks

### 🧾 Commandes

- Historique complet
- Demande de facture
- Demande de retour
- Re-commande

### 🛠️ Panel d’administration

- CRUD complet
- Dashboard avec datavisualisation
- Widgets personnalisables

### 🧨 Suppression RGPD

- Anonymisation des données utilisateur supprimées
- Possibilité de recréer un compte avec mêmes données

## 👥 Rôles utilisateurs

| Rôle               | Description                                       |
|--------------------|---------------------------------------------------|
| `ROLE_USER`        | Client classique                                  |
| `ROLE_STORE_KEEPER`| Gestionnaire de stock                             |
| `ROLE_ADMIN`       | Administrateur complet                            |
| `ROLE_COMPTA`      | Accès aux dashboards financiers + export factures |
| Connexion admin    | Assistance directe dans l’interface utilisateur   |

## 📁 Structure du projet

```bash
📦 marketplace-project
├── backend/            # ExpressJS + MongoDB
├── frontend/           # VueJS + Tailwind
├── docker-compose.yml
├── README.md
└── .git/               # Historique Git (commits signés requis)
```

## 📌 Conventions Git

### 📝 Commits

```
Feature: feature/(sujet) : sujet
Correction: fix/(nomDeL'issue) : sujet
Documentation: docs/(numéroDeL'issue) : sujet
```

### 🌿 Branches

```
feature/{nomDeL'issue}
fix/{nomDeL'issue}
docs/{numéroDeL'issue}
```

### 🔀 Merge Requests

- Doivent viser la branche `develop`
- Doivent être validées par un membre de l’équipe

## 📤 Mise en production

- Déploiement requis 2 semaines avant soutenance
- Archive `.zip` avec `.git` incluse obligatoire
- Hébergement possible sur :
  - VPS / dédié
  - DIGITALOCEAN 
  - Docker

## 👨‍💻 Équipe projet

| Nom                   | GitHub                                  | Contribution                                 |
|------------------------|------------------------------------------|----------------------------------------------|
| Yassine BOULAHNINE     | [@yasblha](https://github.com/yasblha)   | Backend API, sécurité, Docker, RGPD          |
| Yassine BOULAHNINE     | [@yasblha](https://github.com/yasblha)   | Frontend client, intégration Stripe          |
| Yassine BOULAHNINE     | [@yasblha](https://github.com/yasblha)   | Admin panel, livraisons, dataviz             |
| Yassine BOULAHNINE     | [@yasblha](https://github.com/yasblha)   | Tests, UX, login sécurisé                    |

## 🛡️ RGPD & Conformité

- Consentement cookies (popup, bloc texte)
- Export des données personnelles
- Suppression/anonymisation compte
- Base exportable pour vérification CNIL / INPI

## 📃 Licence

Projet réalisé dans le cadre du challenge.  
Ne pas utiliser en production sans refonte complète.

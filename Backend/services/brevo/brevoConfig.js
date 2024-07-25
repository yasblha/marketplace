const brevoMailing = require("../../server");

const brevoMailingConfig = {
    "Product.productAvailable": [
      {
        templateId: 1,
        subject: 'Produit Disponible',
        type: 'alert'
      },
    ],
    "Product.OutOfStock": [
      {     
        templateId: 12,
        subject: 'Produit en rupture de stock',
        type: 'alert'
      },
    ],
    "Newsletter.subscription": [
      {
        templateId: 3,
        subject: 'Merci pour votre abonnement à notre newsletter',
        type: 'newsletter'
      },
    ],
    "Newsletter.unsubscription": [
      {
        templateId: 3,
        subject: 'Merci pour votre abonnement à notre newsletter',
        type: 'newsletter'
      },
    ],
    "Issue.reported": [
      {
        templateId: 4,
        subject: 'Votre rapport de litige a été reçu',
        type: 'mail'
      },
    ],
    "Welcome.newUser": [
      {
        templateId: 5,
        subject: 'Bienvenue sur notre plateforme',
        type: 'mail'
      },
    ],
    
    
    // "Password.updated": [
    //   {
    //     templateId: 10,
    //     subject: 'Votre mot de passe a été mis à jour',
    //     type: 'mail'
    //   },
    // ],
   
  };
  
  module.exports = brevoMailingConfig;
  
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Configuration alternative pour les tests (utilise Mailtrap ou similaire)
const testTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'test-user',
    pass: process.env.SMTP_PASS || 'test-password'
  }
});

// Utiliser le transporteur de test en développement
const emailTransporter = process.env.NODE_ENV === 'production' ? transporter : testTransporter;

/**
 * Envoyer un email
 * @param {Object} options - Options d'envoi
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.html - Contenu HTML
 * @param {string} options.text - Contenu texte (optionnel)
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Marketplace <noreply@marketplace.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '') // Convertir HTML en texte
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

/**
 * Envoyer un email de newsletter
 * @param {string} to - Email du destinataire
 * @param {string} subject - Sujet de la newsletter
 * @param {string} content - Contenu de la newsletter
 */
export const sendNewsletterEmail = async (to, subject, content) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f8f9fa; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Marketplace</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Vous recevez cet email car vous êtes inscrit à notre newsletter.</p>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe">Se désinscrire</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html
  });
};

/**
 * Envoyer un email d'alerte de nouveaux produits
 * @param {string} to - Email du destinataire
 * @param {Array} products - Liste des nouveaux produits
 * @param {string} category - Catégorie (optionnel)
 */
export const sendNewProductAlert = async (to, products, category = null) => {
  const subject = category 
    ? `Nouveaux produits dans la catégorie ${category}`
    : 'Nouveaux produits disponibles';

  const productList = products.map(product => `
    <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
      <h3>${product.name}</h3>
      <p><strong>Prix:</strong> ${product.price}€</p>
      <p><strong>Description:</strong> ${product.description || 'Aucune description disponible'}</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/product/${product._id}" class="btn">Voir le produit</a>
    </div>
  `).join('');

  const content = `
    <h2>${subject}</h2>
    <p>Découvrez les nouveaux produits qui viennent d'arriver sur notre marketplace !</p>
    ${productList}
    <p style="margin-top: 20px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" class="btn">Voir tous les produits</a>
    </p>
  `;

  return sendNewsletterEmail(to, subject, content);
};

/**
 * Envoyer un email d'alerte de restock
 * @param {string} to - Email du destinataire
 * @param {Object} product - Produit en stock
 */
export const sendRestockAlert = async (to, product) => {
  const subject = `${product.name} est de nouveau en stock !`;

  const content = `
    <h2>Produit de nouveau disponible !</h2>
    <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
      <h3>${product.name}</h3>
      <p><strong>Prix:</strong> ${product.price}€</p>
      <p><strong>Stock disponible:</strong> ${product.stock_available}</p>
      <p><strong>Description:</strong> ${product.description || 'Aucune description disponible'}</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/product/${product._id}" class="btn">Acheter maintenant</a>
    </div>
  `;

  return sendNewsletterEmail(to, subject, content);
};

/**
 * Envoyer un email d'alerte de changement de prix
 * @param {string} to - Email du destinataire
 * @param {Object} product - Produit avec prix modifié
 */
export const sendPriceChangeAlert = async (to, product) => {
  const subject = `Prix modifié pour ${product.name}`;

  const content = `
    <h2>Prix modifié !</h2>
    <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
      <h3>${product.name}</h3>
      <p><strong>Nouveau prix:</strong> ${product.price}€</p>
      <p><strong>Stock disponible:</strong> ${product.stock_available}</p>
      <p><strong>Description:</strong> ${product.description || 'Aucune description disponible'}</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/product/${product._id}" class="btn">Voir le produit</a>
    </div>
  `;

  return sendNewsletterEmail(to, subject, content);
};

export default {
  sendEmail,
  sendNewsletterEmail,
  sendNewProductAlert,
  sendRestockAlert,
  sendPriceChangeAlert
}; 
import { sendEmail } from './mailer.js';
import User from '../models/postgres_models/UserPg.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

/**
 * Service pour gérer le renouvellement des mots de passe
 */
class PasswordRenewalService {
  /**
   * Vérifie les mots de passe qui doivent être renouvelés (plus de 60 jours)
   * @returns {Promise<void>}
   */
  static async checkPasswordsToRenew() {
    try {
      // Calculer la date limite (60 jours avant aujourd'hui)
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() - 60);
      
      // Trouver tous les utilisateurs dont le mot de passe a été changé il y a plus de 60 jours
      // ou dont le champ password_last_changed est null (jamais changé)
      const usersToRenew = await User.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { password_last_changed: { [Op.lt]: renewalDate } },
                { password_last_changed: null }
              ]
            },
            { password_renewal_notified: false }
          ]
        }
      });
      
      console.log(`Found ${usersToRenew.length} users needing password renewal`);
      
      // Envoyer un email à chaque utilisateur
      for (const user of usersToRenew) {
        await this.sendPasswordRenewalEmail(user);
        
        // Marquer comme notifié pour éviter les envois répétés
        await User.update(
          { password_renewal_notified: true },
          { where: { id: user.id } }
        );
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des mots de passe à renouveler:', error);
    }
  }
  
  /**
   * Envoie un email demandant le renouvellement du mot de passe
   * @param {User} user - L'utilisateur concerné
   * @returns {Promise<void>}
   */
  static async sendPasswordRenewalEmail(user) {
    try {
      // Générer un token de réinitialisation
      const token = crypto.randomBytes(32).toString('hex');
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1); // Token valable 24h
      
      // Sauvegarder le token dans la base de données
      await User.update(
        {
          reset_token: token,
          reset_token_expiry: expiryDate
        },
        { where: { id: user.id } }
      );
      
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
      
      const subject = 'Votre mot de passe doit être renouvelé';
      const htmlContent = `
        <h1>Renouvellement de votre mot de passe</h1>
        <p>Bonjour ${user.firstname},</p>
        <p>Pour des raisons de sécurité, nous vous demandons de renouveler votre mot de passe car celui-ci n'a pas été changé depuis plus de 60 jours.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Renouveler mon mot de passe</a>
        <p>Ce lien est valable pendant 24 heures.</p>
        <p>Si vous n'avez pas demandé ce changement, veuillez ignorer cet email ou contacter notre support.</p>
        <p>Merci,<br>L'équipe E-commerce</p>
      `;
      
      await sendEmail(user.email, subject, htmlContent);
      console.log(`Password renewal email sent to ${user.email}`);
    } catch (error) {
      console.error(`Error sending password renewal email to ${user.email}:`, error);
    }
  }
}

export default PasswordRenewalService;

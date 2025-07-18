import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  /**
   * Obtient un transporteur d'email configuré
   * @returns {Object} - Transporteur nodemailer
   */
  getTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.MAIL_PORT || 2525,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER || 'test',
        pass: process.env.MAIL_PASSWORD || 'test'
      }
    });
  }
  
  /**
   * Envoie un email
   * @param {Object} options - Options d'envoi d'email
   * @returns {Promise} - Résultat de l'envoi
   */
  async sendEmail(options) {
    const transporter = this.getTransporter();
    return await transporter.sendMail(options);
  }
}

export default new EmailService();

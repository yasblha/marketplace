// services/passwordRenewalService.js
import User from '../models/postgres_models/UserPg.js';
import { sendEmail } from './mailer.js';
import crypto from 'crypto';

/**
 * Vérifie tous les utilisateurs et envoie des emails de renouvellement de mot de passe
 * lorsque leur mot de passe n'a pas été changé depuis plus de 60 jours
 */
async function checkPasswordRenewal() {
    try {
        const users = await User.findAll();
        const currentDate = new Date();
        const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
        const resetPasswordBaseUrl = `${frontendBaseUrl}/reset-password/`;
        const sixtyDaysInMillis = 60 * 24 * 60 * 60 * 1000; // 60 jours en millisecondes

        console.log(`Vérification des mots de passe à renouveler pour ${users.length} utilisateurs`);
        
        for (const user of users) {
            // On vérifie si l'utilisateur a déjà été notifié pour éviter les emails en double
            if (user.password_renewal_notified) {
                continue;
            }
            
            let shouldSendEmail = false;
            let emailType = '';
            
            const accountCreatedDate = new Date(user.account_created_at || new Date());
            const passwordLastChanged = user.password_last_changed ? new Date(user.password_last_changed) : accountCreatedDate;
            
            // Vérifier si le compte existe depuis plus de 60 jours sans changement de mot de passe
            if (!user.password_last_changed && (currentDate.getTime() - accountCreatedDate.getTime() >= sixtyDaysInMillis)) {
                shouldSendEmail = true;
                emailType = 'creation';
            } 
            // Vérifier si le mot de passe a été modifié il y a plus de 60 jours
            else if (user.password_last_changed && (currentDate.getTime() - passwordLastChanged.getTime() >= sixtyDaysInMillis)) {
                shouldSendEmail = true;
                emailType = 'update';
            }
            
            if (shouldSendEmail) {
                // Générer un nouveau token de réinitialisation
                const resetToken = crypto.randomBytes(32).toString('hex');
                const resetTokenExpiry = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Expire dans 24h
                
                // Mettre à jour l'utilisateur avec le nouveau token
                await user.update({
                    reset_token: resetToken,
                    reset_token_expiry: resetTokenExpiry,
                    password_renewal_notified: true
                });
                
                const resetUrl = resetPasswordBaseUrl + resetToken;
                
                // Contenu de l'email en fonction du type
                let subject, content;
                
                if (emailType === 'creation') {
                    subject = 'Sécurisez votre compte en mettant à jour votre mot de passe';
                    content = `
                        <!DOCTYPE html>
                        <html lang="fr">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Mise à jour de mot de passe requise</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    padding: 20px;
                                    background-color: #fff;
                                    border-radius: 5px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                .logo {
                                    text-align: center;
                                    margin-bottom: 20px;
                                }
                                .logo img {
                                    width: 100px;
                                    height: auto;
                                }
                                .email-content {
                                    padding: 20px;
                                }
                                .button {
                                    display: inline-block;
                                    background-color: #007bff;
                                    color: #fff !important;
                                    text-decoration: none;
                                    padding: 10px 20px;
                                    border-radius: 5px;
                                    margin-top: 20px;
                                }
                                .footer {
                                    margin-top: 30px;
                                    padding-top: 10px;
                                    border-top: 1px solid #eee;
                                    font-size: 12px;
                                    color: #666;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="email-content">
                                    <h2>Bonjour ${user.firstname || 'Client'},</h2>
                                    <p>Pour des raisons de sécurité, nous vous recommandons de mettre à jour votre mot de passe car votre compte a été créé il y a plus de 60 jours.</p>
                                    <p>Pour procéder à la mise à jour, veuillez cliquer sur le bouton ci-dessous :</p>
                                    <a href="${resetUrl}" class="button">Mettre à jour mon mot de passe</a>
                                    <p>Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
                                    <p>Si vous n'effectuez pas cette action, votre mot de passe actuel restera valide, mais nous vous encourageons fortement à le mettre à jour régulièrement pour protéger votre compte.</p>
                                    <div class="footer">
                                        <p>Cordialement,<br>L'équipe MambaFit</p>
                                        <p>Si vous n'avez pas de compte sur notre plateforme, veuillez ignorer cet email.</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `;
                } else {
                    subject = 'Renouvellement recommandé de votre mot de passe';
                    content = `
                        <!DOCTYPE html>
                        <html lang="fr">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Renouvellement de mot de passe</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    padding: 20px;
                                    background-color: #fff;
                                    border-radius: 5px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                .logo {
                                    text-align: center;
                                    margin-bottom: 20px;
                                }
                                .logo img {
                                    width: 100px;
                                    height: auto;
                                }
                                .email-content {
                                    padding: 20px;
                                }
                                .button {
                                    display: inline-block;
                                    background-color: #007bff;
                                    color: #fff !important;
                                    text-decoration: none;
                                    padding: 10px 20px;
                                    border-radius: 5px;
                                    margin-top: 20px;
                                }
                                .footer {
                                    margin-top: 30px;
                                    padding-top: 10px;
                                    border-top: 1px solid #eee;
                                    font-size: 12px;
                                    color: #666;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="email-content">
                                    <h2>Bonjour ${user.firstname || 'Client'},</h2>
                                    <p>Votre mot de passe a été modifié il y a plus de 60 jours.</p>
                                    <p>Pour des raisons de sécurité, nous vous recommandons de le renouveler en cliquant sur le bouton ci-dessous :</p>
                                    <a href="${resetUrl}" class="button">Renouveler mon mot de passe</a>
                                    <p>Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
                                    <p>Si vous ne souhaitez pas modifier votre mot de passe maintenant, vous pouvez ignorer cet email. Votre mot de passe actuel restera valide.</p>
                                    <div class="footer">
                                        <p>Cordialement,<br>L'équipe MambaFit</p>
                                        <p>Si vous n'avez pas de compte sur notre plateforme, veuillez ignorer cet email.</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `;
                }
                
                // Envoyer l'email
                await sendEmail(user.email, subject, content);
                console.log(`Email de renouvellement de mot de passe envoyé à ${user.email}`);
            }
        }
        
        console.log('Vérification du renouvellement des mots de passe terminée');
    } catch (error) {
        console.error('Erreur lors de la vérification du renouvellement du mot de passe :', error);
    }
}

export { checkPasswordRenewal };

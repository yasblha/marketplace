import cron from 'node-cron';
import PasswordRenewalService from '../services/passwordRenewalService.js';

/**
 * Initialise les tâches planifiées
 */
function initScheduledTasks() {
  // Vérifier les mots de passe à renouveler tous les jours à minuit
  cron.schedule('0 0 * * *', async () => {
    console.log('Running password renewal check...');
    await PasswordRenewalService.checkPasswordsToRenew();
  });

  console.log('Scheduled tasks initialized');
}

export default initScheduledTasks;

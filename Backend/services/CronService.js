import cron from 'node-cron';
import AlertService from './AlertService.js';
import CartReservationService from './CartReservationService.js';

class CronService {
  static init() {
    console.log('🕐 Initialisation des tâches cron...');

    // Vérifier les alertes de nouveaux produits tous les jours à 9h
    cron.schedule('0 9 * * *', async () => {
      console.log('📧 Vérification des alertes nouveaux produits...');
      try {
        await AlertService.checkNewProductAlerts();
        console.log('✅ Alertes nouveaux produits traitées');
      } catch (error) {
        console.error('❌ Erreur lors de la vérification des alertes nouveaux produits:', error);
      }
    });

    // Vérifier les alertes de restock toutes les heures
    cron.schedule('0 * * * *', async () => {
      console.log('📦 Vérification des alertes restock...');
      try {
        await AlertService.checkRestockAlerts();
        console.log('✅ Alertes restock traitées');
      } catch (error) {
        console.error('❌ Erreur lors de la vérification des alertes restock:', error);
      }
    });

    // Vérifier les alertes de changement de prix toutes les 6 heures
    cron.schedule('0 */6 * * *', async () => {
      console.log('💰 Vérification des alertes changement de prix...');
      try {
        await AlertService.checkPriceChangeAlerts();
        console.log('✅ Alertes changement de prix traitées');
      } catch (error) {
        console.error('❌ Erreur lors de la vérification des alertes changement de prix:', error);
      }
    });

    // Envoyer la newsletter tous les vendredis à 10h
    cron.schedule('0 10 * * 5', async () => {
      console.log('📬 Envoi de la newsletter...');
      try {
        await AlertService.sendNewsletter();
        console.log('✅ Newsletter envoyée');
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de la newsletter:', error);
      }
    });

    // Nettoyer les réservations expirées toutes les 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('🧹 Nettoyage des réservations expirées...');
      try {
        const deletedCount = await CartReservationService.cleanupExpiredReservations();
        if (deletedCount > 0) {
          console.log(`✅ ${deletedCount} réservations expirées nettoyées`);
        }
      } catch (error) {
        console.error('❌ Erreur lors du nettoyage des réservations expirées:', error);
      }
    });

    console.log('✅ Tâches cron initialisées');
  }

  // Méthode pour déclencher manuellement les vérifications (utile pour les tests)
  static async triggerNewProductAlerts() {
    console.log('🔄 Déclenchement manuel des alertes nouveaux produits...');
    await AlertService.checkNewProductAlerts();
  }

  static async triggerRestockAlerts() {
    console.log('🔄 Déclenchement manuel des alertes restock...');
    await AlertService.checkRestockAlerts();
  }

  static async triggerPriceChangeAlerts() {
    console.log('🔄 Déclenchement manuel des alertes changement de prix...');
    await AlertService.checkPriceChangeAlerts();
  }

  static async triggerNewsletter() {
    console.log('🔄 Déclenchement manuel de la newsletter...');
    await AlertService.sendNewsletter();
  }

  static async triggerReservationCleanup() {
    console.log('🔄 Déclenchement manuel du nettoyage des réservations...');
    await CartReservationService.cleanupExpiredReservations();
  }
}

export default CronService; 
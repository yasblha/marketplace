import express from 'express';
import SyncService from '../../services/syncService.js';

const router = express.Router();

// Route pour déclencher une synchronisation complète
router.post('/full-sync', async (req, res) => {
    try {
        console.log('🔄 Synchronisation manuelle demandée...');
        const result = await SyncService.fullSync();
        res.json({
            success: true,
            message: 'Synchronisation complète terminée',
            result
        });
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation manuelle:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la synchronisation',
            error: error.message
        });
    }
});

// Route pour vérifier la cohérence
router.get('/check-consistency', async (req, res) => {
    try {
        const result = await SyncService.checkConsistency();
        res.json({
            success: true,
            result
        });
    } catch (error) {
        console.error('❌ Erreur lors de la vérification de cohérence:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification de cohérence',
            error: error.message
        });
    }
});

// Route pour synchroniser uniquement les produits
router.post('/sync-products', async (req, res) => {
    try {
        const result = await SyncService.syncAllProducts();
        res.json({
            success: true,
            message: 'Synchronisation des produits terminée',
            result
        });
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation des produits:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la synchronisation des produits',
            error: error.message
        });
    }
});

// Route pour nettoyer les produits orphelins
router.post('/cleanup-orphaned', async (req, res) => {
    try {
        const result = await SyncService.cleanupOrphanedProducts();
        res.json({
            success: true,
            message: 'Nettoyage des produits orphelins terminé',
            result
        });
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage des produits orphelins:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du nettoyage des produits orphelins',
            error: error.message
        });
    }
});

export default router; 
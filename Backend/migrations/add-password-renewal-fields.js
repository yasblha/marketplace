import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

async function up() {
  try {
    // Vérifier si le champ password_renewal_notified existe déjà
    await sequelize.getQueryInterface().addColumn('Users', 'password_renewal_notified', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Mise à jour des utilisateurs existants pour initialiser password_last_changed à la date actuelle
    // si ce champ est null
    await sequelize.query(`UPDATE "Users" SET password_last_changed = NOW() WHERE password_last_changed IS NULL`);

    console.log('Migration: Added password renewal fields successfully');
  } catch (error) {
    // Ignorer l'erreur si la colonne existe déjà
    if (!error.message.includes('column already exists')) {
      console.error('Migration failed:', error);
      throw error;
    } else {
      console.log('Column already exists, continuing...');
    }
  }
}

async function down() {
  try {
    await sequelize.getQueryInterface().removeColumn('Users', 'password_renewal_notified');
    
    console.log('Migration: Removed password renewal fields successfully');
  } catch (error) {
    console.error('Migration rollback failed:', error);
    throw error;
  }
}

export { up, down };

// Pour une exécution directe (sans utiliser le système de migrations)
// Décommenter le code ci-dessous pour exécuter directement cette migration

/*
(async () => {
  try {
    await up();
    console.log('Migration executed successfully');
  } catch (error) {
    console.error('Migration execution failed:', error);
  } finally {
    await sequelize.close();
  }
})();
*/

<template>
  <div class="preferences-section">
    <h2 class="section-title">
      <i class="fas fa-cog"></i> Mes Préférences
    </h2>

    <div class="preferences-content">
      <form @submit.prevent="savePreferences" class="preferences-form">
        <div class="preference-group">
          <h3><i class="fas fa-bell"></i> Notifications</h3>
          <div class="preference-items">
            <div class="preference-item">
              <div class="preference-info">
                <label for="emailNotifications">Notifications par Email</label>
                <p class="preference-description">Recevoir des notifications par email pour les mises à jour importantes</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="emailNotifications" 
                  v-model="preferences.emailNotifications"
                />
                <label for="emailNotifications"></label>
              </div>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <label for="orderUpdates">Mises à jour des Commandes</label>
                <p class="preference-description">Être notifié des changements de statut de vos commandes</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="orderUpdates" 
                  v-model="preferences.orderUpdates"
                />
                <label for="orderUpdates"></label>
              </div>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <label for="marketingEmails">Emails Marketing</label>
                <p class="preference-description">Recevoir des offres spéciales et des promotions</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="marketingEmails" 
                  v-model="preferences.marketingEmails"
                />
                <label for="marketingEmails"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="preference-group">
          <h3><i class="fas fa-globe"></i> Langue et Région</h3>
          <div class="preference-items">
            <div class="preference-item">
              <div class="preference-info">
                <label for="language">Langue</label>
                <p class="preference-description">Choisir la langue d'affichage du site</p>
              </div>
              <select id="language" v-model="preferences.language" class="preference-select">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <label for="currency">Devise</label>
                <p class="preference-description">Choisir la devise pour les prix</p>
              </div>
              <select id="currency" v-model="preferences.currency" class="preference-select">
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
                <option value="GBP">Livre (£)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="preference-group">
          <h3><i class="fas fa-shield-alt"></i> Confidentialité</h3>
          <div class="preference-items">
            <div class="preference-item">
              <div class="preference-info">
                <label for="dataCollection">Collecte de Données</label>
                <p class="preference-description">Autoriser la collecte de données pour améliorer votre expérience</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="dataCollection" 
                  v-model="preferences.dataCollection"
                />
                <label for="dataCollection"></label>
              </div>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <label for="twoFactorAuth">Authentification à Deux Facteurs</label>
                <p class="preference-description">Activer la vérification en deux étapes pour plus de sécurité</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="twoFactorAuth" 
                  v-model="preferences.twoFactorAuth"
                />
                <label for="twoFactorAuth"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">
            <i class="fas fa-save"></i> Enregistrer les Préférences
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Preferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  marketingEmails: boolean;
  language: string;
  currency: string;
  dataCollection: boolean;
  twoFactorAuth: boolean;
}

const preferences = ref<Preferences>({
  emailNotifications: true,
  orderUpdates: true,
  marketingEmails: false,
  language: 'fr',
  currency: 'EUR',
  dataCollection: true,
  twoFactorAuth: false
});

const savePreferences = () => {
  // Ici, vous devrez implémenter la sauvegarde des préférences
  // Par exemple, en appelant une API
  console.log('Préférences sauvegardées:', preferences.value);
  // Afficher un message de succès
  alert('Préférences sauvegardées avec succès !');
};
</script>

<style scoped>
.preferences-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #23a6f0;
}

.preferences-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.preference-group {
  margin-bottom: 2rem;
}

.preference-group h3 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preference-group h3 i {
  color: #23a6f0;
}

.preference-items {
  display: grid;
  gap: 1.5rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.preference-info {
  flex: 1;
}

.preference-info label {
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
}

.preference-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.preference-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #333;
  min-width: 150px;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #23a6f0;
}

.toggle-switch input:checked + label:before {
  transform: translateX(26px);
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  background: #23a6f0;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-save:hover {
  background: #1d94d2;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .preference-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .preference-select {
    width: 100%;
  }

  .toggle-switch {
    align-self: flex-end;
  }
}
</style>

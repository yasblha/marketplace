<template>
  <Teleport to="body">
    <!-- Popup de consentement cookies -->
    <Transition name="cookie-fade">
      <div v-if="showConsent" class="cookie-consent-overlay">
        <div class="cookie-consent-modal">
          <div class="cookie-header">
            <h3 class="cookie-title">
              <i class="fas fa-cookie-bite"></i>
              Politique de cookies
            </h3>
            <p class="cookie-subtitle">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site
            </p>
          </div>

          <div class="cookie-content">
            <div class="cookie-categories">
              <!-- Cookies essentiels -->
              <div class="cookie-category">
                <div class="category-header">
                  <div class="category-info">
                    <h4>Cookies essentiels</h4>
                    <p>Nécessaires au fonctionnement du site (authentification, panier)</p>
                  </div>
                  <div class="category-toggle">
                    <input type="checkbox" checked disabled />
                    <label class="toggle-label"></label>
                  </div>
                </div>
              </div>

              <!-- Cookies analytiques -->
              <div class="cookie-category">
                <div class="category-header">
                  <div class="category-info">
                    <h4>Cookies analytiques</h4>
                    <p>Nous aident à comprendre comment vous utilisez notre site</p>
                  </div>
                  <div class="category-toggle">
                    <input 
                      type="checkbox" 
                      v-model="preferences.analytics"
                      id="analytics-cookies"
                    />
                    <label for="analytics-cookies" class="toggle-label"></label>
                  </div>
                </div>
              </div>

              <!-- Cookies marketing -->
              <div class="cookie-category">
                <div class="category-header">
                  <div class="category-info">
                    <h4>Cookies marketing</h4>
                    <p>Utilisés pour vous proposer des contenus personnalisés</p>
                  </div>
                  <div class="category-toggle">
                    <input 
                      type="checkbox" 
                      v-model="preferences.marketing"
                      id="marketing-cookies"
                    />
                    <label for="marketing-cookies" class="toggle-label"></label>
                  </div>
                </div>
              </div>

              <!-- Cookies de préférences -->
              <div class="cookie-category">
                <div class="category-header">
                  <div class="category-info">
                    <h4>Cookies de préférences</h4>
                    <p>Sauvegardent vos choix (langue, devise, thème)</p>
                  </div>
                  <div class="category-toggle">
                    <input 
                      type="checkbox" 
                      v-model="preferences.preferences"
                      id="preferences-cookies"
                    />
                    <label for="preferences-cookies" class="toggle-label"></label>
                  </div>
                </div>
              </div>
            </div>

            <div class="cookie-links">
              <a href="/privacy-policy" class="cookie-link">Politique de confidentialité</a>
              <a href="/cookie-policy" class="cookie-link">Politique des cookies</a>
            </div>
          </div>

          <div class="cookie-actions">
            <button @click="acceptAll" class="btn-accept-all">
              <i class="fas fa-check"></i>
              Accepter tout
            </button>
            <button @click="acceptSelected" class="btn-accept-selected">
              <i class="fas fa-cog"></i>
              Accepter la sélection
            </button>
            <button @click="rejectAll" class="btn-reject">
              <i class="fas fa-times"></i>
              Refuser tout
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bouton de gestion des cookies (toujours visible) -->
    <button 
      v-if="!showConsent && consentGiven" 
      @click="showSettings"
      class="cookie-settings-btn"
      title="Gérer les cookies"
    >
      <i class="fas fa-cookie-bite"></i>
    </button>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const showConsent = ref(false);
const consentGiven = ref(false);
const preferences = ref<CookiePreferences>({
  analytics: false,
  marketing: false,
  preferences: true
});

// Vérifier si le consentement a déjà été donné
const checkConsent = () => {
  const consent = localStorage.getItem('cookie-consent');
  if (consent) {
    const parsed = JSON.parse(consent);
    consentGiven.value = true;
    preferences.value = parsed.preferences;
    return true;
  }
  return false;
};

// Sauvegarder les préférences
const savePreferences = () => {
  const consentData = {
    timestamp: new Date().toISOString(),
    preferences: preferences.value
  };
  localStorage.setItem('cookie-consent', JSON.stringify(consentData));
  consentGiven.value = true;
  
  // Émettre un événement pour informer l'application
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', {
    detail: preferences.value
  }));
};

// Accepter tous les cookies
const acceptAll = () => {
  preferences.value = {
    analytics: true,
    marketing: true,
    preferences: true
  };
  savePreferences();
  showConsent.value = false;
};

// Accepter la sélection
const acceptSelected = () => {
  savePreferences();
  showConsent.value = false;
};

// Refuser tous les cookies (sauf essentiels)
const rejectAll = () => {
  preferences.value = {
    analytics: false,
    marketing: false,
    preferences: false
  };
  savePreferences();
  showConsent.value = false;
};

// Afficher les paramètres
const showSettings = () => {
  showConsent.value = true;
};

// Initialisation
onMounted(() => {
  // Attendre un peu avant d'afficher le popup
  setTimeout(() => {
    if (!checkConsent()) {
      showConsent.value = true;
    }
  }, 1000);
});

// Surveiller les changements de préférences
watch(preferences, (newPrefs) => {
  if (consentGiven.value) {
    savePreferences();
  }
}, { deep: true });
</script>

<style scoped>
.cookie-consent-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.cookie-consent-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.cookie-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

.cookie-title {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cookie-title i {
  color: #3b82f6;
}

.cookie-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.cookie-content {
  padding: 1.5rem;
}

.cookie-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cookie-category {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.category-info h4 {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.category-info p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.category-toggle {
  position: relative;
  flex-shrink: 0;
}

.category-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: relative;
  display: block;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-label:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.category-toggle input:checked + .toggle-label {
  background: #3b82f6;
}

.category-toggle input:checked + .toggle-label:before {
  transform: translateX(20px);
}

.category-toggle input:disabled + .toggle-label {
  background: #9ca3af;
  cursor: not-allowed;
}

.cookie-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cookie-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s;
}

.cookie-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.cookie-actions {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-accept-all,
.btn-accept-selected,
.btn-reject {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  font-size: 0.875rem;
}

.btn-accept-all {
  background: #10b981;
  color: white;
}

.btn-accept-all:hover {
  background: #059669;
}

.btn-accept-selected {
  background: #3b82f6;
  color: white;
}

.btn-accept-selected:hover {
  background: #2563eb;
}

.btn-reject {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-reject:hover {
  background: #e5e7eb;
}

.cookie-settings-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  z-index: 1000;
}

.cookie-settings-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Animations */
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.3s ease;
}

.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .cookie-consent-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cookie-actions {
    flex-direction: column;
  }

  .btn-accept-all,
  .btn-accept-selected,
  .btn-reject {
    width: 100%;
  }
}
</style> 
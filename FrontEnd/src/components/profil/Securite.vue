<template>
  <div class="security-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-shield-alt"></i> Sécurité
      </h2>
    </div>

    <div class="security-grid">
      <!-- Mot de passe -->
      <div class="security-card">
        <div class="card-header">
          <div class="security-type">
            <i class="fas fa-key"></i>
            <span>Mot de passe</span>
          </div>
          <div class="last-update">
            Dernière modification : {{ formatDate(lastPasswordUpdate) }}
          </div>
        </div>

        <div class="card-content">
          <p class="security-description">
            Assurez-vous d'utiliser un mot de passe fort et unique pour protéger votre compte.
          </p>
          <button @click="showPasswordModal = true" class="btn-change">
            <i class="fas fa-edit"></i> Modifier le mot de passe
          </button>
        </div>
      </div>

      <!-- Authentification à deux facteurs -->
      <div class="security-card">
        <div class="card-header">
          <div class="security-type">
            <i class="fas fa-mobile-alt"></i>
            <span>Authentification à deux facteurs</span>
          </div>
          <div class="status-badge" :class="{ active: twoFactorEnabled }">
            {{ twoFactorEnabled ? 'Activée' : 'Désactivée' }}
          </div>
        </div>

        <div class="card-content">
          <p class="security-description">
            Ajoutez une couche de sécurité supplémentaire à votre compte en activant l'authentification à deux facteurs.
          </p>
          <button @click="toggleTwoFactor" :class="['btn-toggle', { active: twoFactorEnabled }]">
            <i :class="twoFactorEnabled ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
            {{ twoFactorEnabled ? 'Désactiver' : 'Activer' }} l'authentification à deux facteurs
          </button>
        </div>
      </div>

      <!-- Sessions actives -->
      <div class="security-card">
        <div class="card-header">
          <div class="security-type">
            <i class="fas fa-desktop"></i>
            <span>Sessions actives</span>
          </div>
        </div>

        <div class="card-content">
          <div class="sessions-list">
            <div v-for="session in activeSessions" :key="session.id" class="session-item">
              <div class="session-info">
                <i :class="getDeviceIcon(session.device)"></i>
                <div class="session-details">
                  <h4>{{ session.device }}</h4>
                  <p>{{ session.location }} - {{ formatDate(session.lastActive) }}</p>
                </div>
              </div>
              <button 
                v-if="!session.current" 
                @click="terminateSession(session)" 
                class="btn-terminate"
                title="Terminer la session"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Journal d'activité -->
      <div class="security-card">
        <div class="card-header">
          <div class="security-type">
            <i class="fas fa-history"></i>
            <span>Journal d'activité</span>
          </div>
        </div>

        <div class="card-content">
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <i :class="getActivityIcon(activity.type)"></i>
              <div class="activity-details">
                <p>{{ activity.description }}</p>
                <span class="activity-date">{{ formatDate(activity.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de changement de mot de passe -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Modifier le mot de passe</h3>
          <button @click="showPasswordModal = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="updatePassword" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Mot de passe actuel</label>
            <input 
              type="password" 
              id="currentPassword" 
              v-model="passwordForm.currentPassword"
              required
            />
          </div>

          <div class="form-group">
            <label for="newPassword">Nouveau mot de passe</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="passwordForm.newPassword"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="passwordForm.confirmPassword"
              required
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="showPasswordModal = false" class="btn-cancel">
              Annuler
            </button>
            <button type="submit" class="btn-submit">
              <i class="fas fa-save"></i> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Session {
  id: number;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  date: string;
}

const lastPasswordUpdate = ref('2024-03-01');
const twoFactorEnabled = ref(false);
const showPasswordModal = ref(false);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const activeSessions = ref<Session[]>([
  {
    id: 1,
    device: 'Chrome sur Windows',
    location: 'Paris, France',
    lastActive: '2024-03-15T14:30:00',
    current: true
  },
  {
    id: 2,
    device: 'Safari sur iPhone',
    location: 'Lyon, France',
    lastActive: '2024-03-15T10:15:00',
    current: false
  }
]);

const recentActivities = ref<Activity[]>([
  {
    id: 1,
    type: 'login',
    description: 'Connexion depuis Chrome sur Windows',
    date: '2024-03-15T14:30:00'
  },
  {
    id: 2,
    type: 'password',
    description: 'Modification du mot de passe',
    date: '2024-03-01T09:45:00'
  },
  {
    id: 3,
    type: 'address',
    description: 'Ajout d\'une nouvelle adresse',
    date: '2024-02-28T16:20:00'
  }
]);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDeviceIcon = (device: string) => {
  if (device.includes('Windows')) return 'fas fa-desktop';
  if (device.includes('iPhone')) return 'fas fa-mobile-alt';
  return 'fas fa-laptop';
};

const getActivityIcon = (type: string) => {
  const icons = {
    login: 'fas fa-sign-in-alt',
    password: 'fas fa-key',
    address: 'fas fa-map-marker-alt'
  };
  return icons[type as keyof typeof icons] || 'fas fa-info-circle';
};

const toggleTwoFactor = () => {
  if (!twoFactorEnabled.value) {
    // Implémenter l'activation de la 2FA
    alert('Fonctionnalité d\'activation de la 2FA à implémenter');
  } else {
    twoFactorEnabled.value = false;
  }
};

const terminateSession = (session: Session) => {
  if (confirm('Êtes-vous sûr de vouloir terminer cette session ?')) {
    const index = activeSessions.value.indexOf(session);
    if (index > -1) {
      activeSessions.value.splice(index, 1);
    }
  }
};

const updatePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }
  // Implémenter la mise à jour du mot de passe
  alert('Fonctionnalité de mise à jour du mot de passe à implémenter');
  showPasswordModal.value = false;
};
</script>

<style scoped>
.security-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  color: #333;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.section-title i {
  color: #23a6f0;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.security-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.security-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.security-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #333;
  font-weight: 500;
}

.security-type i {
  color: #23a6f0;
  font-size: 1.2rem;
}

.last-update {
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: #ffebee;
  color: #d32f2f;
}

.status-badge.active {
  background: #e8f5e9;
  color: #388e3c;
}

.card-content {
  padding: 1.5rem;
}

.security-description {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.btn-change,
.btn-toggle {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-change {
  background: #23a6f0;
  color: #fff;
  border: none;
}

.btn-change:hover {
  background: #1d94d2;
}

.btn-toggle {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}

.btn-toggle:hover {
  border-color: #23a6f0;
  color: #23a6f0;
}

.btn-toggle.active {
  background: #e8f5e9;
  border-color: #388e3c;
  color: #388e3c;
}

.sessions-list,
.activity-list {
  display: grid;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.session-info i {
  font-size: 1.2rem;
  color: #23a6f0;
}

.session-details h4 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.session-details p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.btn-terminate {
  background: none;
  border: none;
  color: #666;
  padding: 0.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-terminate:hover {
  color: #dc3545;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.activity-item i {
  color: #23a6f0;
  font-size: 1.2rem;
  margin-top: 0.25rem;
}

.activity-details p {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
}

.activity-date {
  color: #666;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #dc3545;
}

.password-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #23a6f0;
  outline: none;
  box-shadow: 0 0 0 2px rgba(35, 166, 240, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-submit {
  background: #23a6f0;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-submit:hover {
  background: #1d94d2;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .security-grid {
    grid-template-columns: 1fr;
  }

  .session-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .session-info {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style> 
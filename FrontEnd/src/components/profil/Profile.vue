<template>
  <div class="profile-section">
    <div class="profile-header">
      <div class="profile-icon">
        <i class="fas fa-user-circle"></i>
      </div>
      <h2>{{ profile.firstName }} {{ profile.lastName }}</h2>
      <p class="user-email">{{ profile.email }}</p>
    </div>

    <div class="profile-content">
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-section">
          <h3><i class="fas fa-user"></i> Informations Personnelles</h3>
          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input type="text" id="firstName" v-model="profile.firstName" required />
          </div>
          <div class="form-group">
            <label for="lastName">Nom</label>
            <input type="text" id="lastName" v-model="profile.lastName" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="profile.email" required />
          </div>
        </div>

        <div class="form-section">
          <h3><i class="fas fa-lock"></i> Changer le Mot de Passe</h3>
          <div class="form-group">
            <label for="currentPassword">Mot de Passe Actuel</label>
            <input type="password" id="currentPassword" v-model="password.current" />
          </div>
          <div class="form-group">
            <label for="newPassword">Nouveau Mot de Passe</label>
            <input type="password" id="newPassword" v-model="password.new" />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirmer le Mot de Passe</label>
            <input type="password" id="confirmPassword" v-model="password.confirm" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            <i class="fas fa-save"></i> Enregistrer les Modifications
          </button>
          <button type="button" @click="updatePassword" class="btn-secondary">
            <i class="fas fa-key"></i> Changer le Mot de Passe
          </button>
        </div>
      </form>
    </div>

    <div v-if="message" :class="['message', message.type]">
      <i :class="message.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/user';

const authStore = useAuthStore();

const profile = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || ''
});

const password = ref({
  current: '',
  new: '',
  confirm: ''
});

const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    profile.value = {
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      email: newUser.email || ''
    };
  }
});

const updateProfile = async () => {
  try {
    await authStore.updateProfile({
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      email: profile.value.email
    });
    message.value = { text: 'Profil mis à jour avec succès', type: 'success' };
  } catch (error) {
    message.value = { text: 'Erreur lors de la mise à jour du profil', type: 'error' };
  }
};

const updatePassword = async () => {
  if (password.value.new !== password.value.confirm) {
    message.value = { text: 'Les mots de passe ne correspondent pas', type: 'error' };
    return;
  }

  try {
    await authStore.updatePassword(password.value.current, password.value.new);
    message.value = { text: 'Mot de passe mis à jour avec succès', type: 'success' };
    password.value = { current: '', new: '', confirm: '' };
  } catch (error) {
    message.value = { text: 'Erreur lors de la mise à jour du mot de passe', type: 'error' };
  }
};
</script>

<style scoped>
.profile-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.profile-icon {
  font-size: 5rem;
  color: #23a6f0;
  margin-bottom: 1rem;
}

.profile-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.user-email {
  color: #666;
  font-size: 1.1rem;
}

.profile-content {
  display: grid;
  gap: 2rem;
}

.form-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.form-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-section h3 i {
  color: #23a6f0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
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

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #23a6f0;
  color: #f8f9fa;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-primary:hover {
  background-color: #1d94d2;
  transform: translateY(-1px);
}

.btn-secondary:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .profile-section {
    margin: 1rem;
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>

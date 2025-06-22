<template>
  <div class="payment-methods">
    <h2 class="section-title">
      <i class="fas fa-credit-card"></i> Mes Moyens de Paiement
    </h2>

    <div class="payment-list">
      <div v-for="(method, index) in paymentMethods" :key="index" class="payment-card">
        <div class="card-info">
          <i :class="getCardIcon(method.type)" class="card-icon"></i>
          <div class="card-details">
            <h3>{{ method.type }}</h3>
            <p class="card-number">**** **** **** {{ method.last4 }}</p>
            <p class="card-expiry">Expire le {{ method.expiryMonth }}/{{ method.expiryYear }}</p>
          </div>
        </div>
        <div class="card-actions">
          <button @click="setDefaultMethod(method)" :class="{ 'default': method.isDefault }" class="btn-default">
            <i class="fas" :class="method.isDefault ? 'fa-check-circle' : 'fa-circle'"></i>
            {{ method.isDefault ? 'Méthode par défaut' : 'Définir par défaut' }}
          </button>
          <button @click="deleteMethod(method)" class="btn-delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <button @click="showAddCard = true" class="btn-add">
      <i class="fas fa-plus"></i> Ajouter une Carte
    </button>

    <!-- Modal d'ajout de carte -->
    <div v-if="showAddCard" class="modal-overlay">
      <div class="modal-content">
        <h3>Ajouter une Carte</h3>
        <form @submit.prevent="addCard" class="add-card-form">
          <div class="form-group">
            <label for="cardNumber">Numéro de Carte</label>
            <input 
              type="text" 
              id="cardNumber" 
              v-model="newCard.number"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input="formatCardNumber"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="expiryMonth">Mois d'Expiration</label>
              <input 
                type="text" 
                id="expiryMonth" 
                v-model="newCard.expiryMonth"
                placeholder="MM"
                maxlength="2"
                required
              />
            </div>
            <div class="form-group">
              <label for="expiryYear">Année d'Expiration</label>
              <input 
                type="text" 
                id="expiryYear" 
                v-model="newCard.expiryYear"
                placeholder="AA"
                maxlength="2"
                required
              />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input 
                type="password" 
                id="cvv" 
                v-model="newCard.cvv"
                placeholder="123"
                maxlength="3"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="cardName">Nom sur la Carte</label>
            <input 
              type="text" 
              id="cardName" 
              v-model="newCard.name"
              placeholder="JEAN DUPONT"
              required
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="showAddCard = false" class="btn-cancel">
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

interface PaymentMethod {
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

const paymentMethods = ref<PaymentMethod[]>([
  {
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '24',
    isDefault: true
  }
]);

const showAddCard = ref(false);
const newCard = ref({
  number: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  name: ''
});

const getCardIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    'Visa': 'fab fa-cc-visa',
    'Mastercard': 'fab fa-cc-mastercard',
    'American Express': 'fab fa-cc-amex',
    'default': 'fas fa-credit-card'
  };
  return icons[type] || icons.default;
};

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  value = value.replace(/(\d{4})/g, '$1 ').trim();
  newCard.value.number = value;
};

const addCard = () => {
  // (Stripe, PayPal, etc.)
  const last4 = newCard.value.number.slice(-4);
  paymentMethods.value.push({
    type: 'Visa',
    last4,
    expiryMonth: newCard.value.expiryMonth,
    expiryYear: newCard.value.expiryYear,
    isDefault: false
  });
  showAddCard.value = false;
  newCard.value = {
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: ''
  };
};

const setDefaultMethod = (method: PaymentMethod) => {
  paymentMethods.value.forEach(m => m.isDefault = false);
  method.isDefault = true;
};

const deleteMethod = (method: PaymentMethod) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
    const index = paymentMethods.value.indexOf(method);
    if (index > -1) {
      paymentMethods.value.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.payment-methods {
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

.payment-list {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.payment-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  font-size: 2rem;
  color: #23a6f0;
}

.card-details h3 {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
}

.card-number {
  color: #666;
  margin: 0.25rem 0;
}

.card-expiry {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 1rem;
}

.btn-default {
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-default.default {
  background: #e3f2fd;
  border-color: #23a6f0;
  color: #23a6f0;
}

.btn-delete {
  background: #fff;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover {
  background: #dc3545;
  color: #fff;
}

.btn-add {
  background: #23a6f0;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-add:hover {
  background: #1d94d2;
  transform: translateY(-2px);
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
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.add-card-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
}

.form-group input:focus {
  border-color: #23a6f0;
  outline: none;
  box-shadow: 0 0 0 2px rgba(35, 166, 240, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
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
}

.btn-submit:hover {
  background: #1d94d2;
}

@media (max-width: 768px) {
  .payment-card {
    flex-direction: column;
    gap: 1rem;
  }

  .card-actions {
    width: 100%;
    justify-content: space-between;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
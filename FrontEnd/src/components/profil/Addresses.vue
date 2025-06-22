<template>
  <div class="addresses-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-map-marker-alt"></i> Mes Adresses
      </h2>
      <button @click="showAddAddress = true" class="btn-add" v-if="addresses.length > 0">
        <i class="fas fa-plus"></i> Nouvelle Adresse
      </button>
    </div>

    <div class="addresses-grid">
      <div v-if="addresses.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-map-marked-alt"></i>
        </div>
        <h3>Aucune adresse enregistrée</h3>
        <p>Ajoutez votre première adresse pour faciliter vos achats</p>
        <button @click="showAddAddress = true" class="btn-add">
          <i class="fas fa-plus"></i> Ajouter une adresse
        </button>
      </div>
      <div v-else v-for="(address, index) in addresses" :key="index" class="address-card">
        <div class="card-header">
          <div class="address-type" :class="address.type.toLowerCase()">
            <i class="fas" :class="address.type === 'Livraison' ? 'fa-truck' : 'fa-file-invoice'"></i>
            {{ address.type }}
          </div>
          <div class="card-actions">
            <button @click="editAddress(address)" class="btn-icon" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(address)" class="btn-icon delete" title="Supprimer">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="card-content">
          <h3 class="address-title">{{ address.title }}</h3>
          <div class="address-details">
            <p><i class="fas fa-user"></i> {{ address.fullname }}</p>
            <p><i class="fas fa-road"></i> {{ address.address }}</p>
            <p><i class="fas fa-map"></i> {{ address.postalcode }} {{ address.city }}</p>
            <p v-if="address.department"><i class="fas fa-building"></i> {{ address.department }}</p>
            <p><i class="fas fa-flag"></i> {{ address.country }}</p>
          </div>
        </div>

        <div class="card-footer">
          <button 
            @click="setDefaultAddress(address)" 
            :class="['btn-default', { active: address.isDefault }]"
          >
            <i class="fas" :class="address.isDefault ? 'fa-check-circle' : 'fa-circle'"></i>
            {{ address.isDefault ? 'Adresse par défaut' : 'Définir par défaut' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification d'adresse -->
    <div v-if="showAddAddress" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingAddress ? 'Modifier l\'Adresse' : 'Nouvelle Adresse' }}</h3>
          <button @click="closeModal" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveAddress" class="address-form">
          <div class="form-group">
            <label for="fullname">Nom complet</label>
            <input 
              type="text" 
              id="fullname" 
              v-model="newAddress.fullname"
              placeholder="Prénom et nom"
              required
            />
          </div>

          <div class="form-group">
            <label for="title">Titre de l'adresse</label>
            <input 
              type="text" 
              id="title" 
              v-model="newAddress.title"
              placeholder="Ex: Domicile, Bureau..."
              required
            />
          </div>

          <div class="form-group">
            <label for="type">Type d'adresse</label>
            <div class="type-selector">
              <button 
                type="button"
                :class="['type-btn', { active: newAddress.type === 'Livraison' }]"
                @click="newAddress.type = 'Livraison'"
              >
                <i class="fas fa-truck"></i> Livraison
              </button>
              <button 
                type="button"
                :class="['type-btn', { active: newAddress.type === 'Facturation' }]"
                @click="newAddress.type = 'Facturation'"
              >
                <i class="fas fa-file-invoice"></i> Facturation
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="address">Adresse</label>
            <input 
              type="text" 
              id="address" 
              v-model="newAddress.address"
              placeholder="Numéro et nom de rue"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="postalcode">Code Postal</label>
              <input 
                type="text" 
                id="postalcode" 
                v-model="newAddress.postalcode"
                placeholder="75000"
                required
              />
            </div>
            <div class="form-group">
              <label for="city">Ville</label>
              <input 
                type="text" 
                id="city" 
                v-model="newAddress.city"
                placeholder="Paris"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="department">Département</label>
            <input 
              type="text" 
              id="department" 
              v-model="newAddress.department"
              placeholder="Département (optionnel)"
            />
          </div>

          <div class="form-group">
            <label for="country">Pays</label>
            <select id="country" v-model="newAddress.country" required>
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              Annuler
            </button>
            <button type="submit" class="btn-submit">
              <i class="fas fa-save"></i> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal-content delete-confirm">
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button @click="showDeleteConfirm = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer cette adresse ?</p>
          <div class="address-preview">
            <p><strong>{{ addressToDelete?.title }}</strong></p>
            <p>{{ addressToDelete?.address }}</p>
            <p>{{ addressToDelete?.postalcode }} {{ addressToDelete?.city }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteConfirm = false" class="btn-cancel">
            Annuler
          </button>
          <button @click="confirmDeleteAddress" class="btn-delete">
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Address {
  title: string;
  fullname: string;
  type: 'Livraison' | 'Facturation';
  address: string;
  postalcode: string;
  city: string;
  department?: string;
  country: string;
  isDefault: boolean;
}

const addresses = ref<Address[]>([
  {
    title: 'Domicile',
    fullname: 'John Doe',
    type: 'Livraison',
    address: '123 Rue de la Paix',
    postalcode: '75001',
    city: 'Paris',
    department: 'Île-de-France',
    country: 'France',
    isDefault: true
  }
]);

const showAddAddress = ref(false);
const showDeleteConfirm = ref(false);
const editingAddress = ref<Address | null>(null);
const addressToDelete = ref<Address | null>(null);
const newAddress = ref<Address>({
  title: '',
  fullname: '',
  type: 'Livraison',
  address: '',
  postalcode: '',
  city: '',
  department: '',
  country: 'France',
  isDefault: false
});

const editAddress = (address: Address) => {
  editingAddress.value = address;
  newAddress.value = { ...address };
  showAddAddress.value = true;
};

const confirmDelete = (address: Address) => {
  addressToDelete.value = address;
  showDeleteConfirm.value = true;
};

const confirmDeleteAddress = () => {
  if (addressToDelete.value) {
    addresses.value = addresses.value.filter(addr => addr !== addressToDelete.value);
    showDeleteConfirm.value = false;
    addressToDelete.value = null;
  }
};

const setDefaultAddress = (address: Address) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr === address;
  });
};

const saveAddress = () => {
  if (editingAddress.value) {
    const index = addresses.value.indexOf(editingAddress.value);
    addresses.value[index] = { ...newAddress.value };
  } else {
    addresses.value.push({ ...newAddress.value });
  }
  closeModal();
};

const closeModal = () => {
  showAddAddress.value = false;
  editingAddress.value = null;
  newAddress.value = {
    title: '',
    fullname: '',
    type: 'Livraison',
    address: '',
    postalcode: '',
    city: '',
    department: '',
    country: 'France',
    isDefault: false
  };
};
</script>

<style scoped>
.addresses-section {
  padding: 2rem;
  background: #f8f9fa; /* Changed background for better visibility */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow */
  margin-bottom: 2rem; /* Added margin for spacing */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem; /* Added padding */
  border-bottom: 1px solid #e0e0e0; /* Added border */
}

.section-title {
  font-size: 1.8rem; /* Larger font size */
  color: #333; /* Darker text */
  display: flex;
  align-items: center;
  gap: 0.8rem; /* Increased gap */
}

.section-title i {
  color: #007bff; /* Highlight icon color */
}

.btn-add {
  background: #007bff; /* Changed button color */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500; /* Added font weight */
}

.btn-add:hover {
  background: #0056b3; /* Darker hover color */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Added shadow on hover */
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem; /* Increased padding */
  background: #e9ecef; /* Lighter background */
  border-radius: 12px;
  border: 2px dashed #ced4da; /* Slightly darker dashed border */
  color: #495057; /* Darker text color */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05); /* Inner shadow */
}

.empty-state-icon {
  font-size: 4rem; /* Larger icon */
  color: #adb5bd; /* Greyer icon */
  margin-bottom: 1.5rem; /* Increased margin */
}

.empty-state h3 {
  color: #343a40; /* Darker heading */
  margin-bottom: 0.75rem; /* Adjusted margin */
  font-size: 1.6rem; /* Larger heading font */
}

.empty-state p {
  color: #6c757d; /* Consistent paragraph color */
  margin-bottom: 2rem; /* Increased margin */
  font-size: 1.1rem; /* Larger paragraph font */
}

.empty-state .btn-add {
  background: #28a745; /* Green button for empty state */
}

.empty-state .btn-add:hover {
  background: #218838; /* Darker green hover */
}

.address-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Added shadow transition */
}

.address-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow on hover */
}

.card-header {
  padding: 1rem 1.5rem; /* Adjusted padding */
  background: #f1f3f5; /* Lighter header background */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6; /* Added border */
}

.address-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem; /* Adjusted padding */
  border-radius: 15px; /* Slightly smaller border radius */
  font-size: 0.8rem; /* Smaller font size */
  font-weight: 600; /* Bolder font */
  text-transform: uppercase; /* Uppercase text */
}

.address-type i {
  font-size: 1rem; /* Icon size */
}

.address-type.livraison {
  background: #cfe2ff; /* Light blue background */
  color: #084298; /* Dark blue text */
}

.address-type.facturation {
  background: #e2d9eb; /* Light purple background */
  color: #5a1f7c; /* Dark purple text */
}

.card-actions {
  display: flex;
  gap: 0.25rem; /* Reduced gap */
}

.btn-icon {
  background: none;
  border: none;
  padding: 0.4rem; /* Adjusted padding */
  cursor: pointer;
  color: #6c757d; /* Darker icon color */
  transition: color 0.2s ease, transform 0.2s ease; /* Added transform transition */
}

.btn-icon:hover {
  color: #007bff; /* Highlight color on hover */
  transform: scale(1.1); /* Slightly enlarge on hover */
}

.btn-icon.delete:hover {
  color: #dc3545; /* Red on delete hover */
}

.card-content {
  padding: 1.5rem;
}

.address-title {
  font-size: 1.3rem; /* Slightly larger title */
  color: #343a40; /* Darker title color */
  margin-bottom: 1rem;
}

.address-details p {
  display: flex;
  align-items: center;
  gap: 0.6rem; /* Increased gap */
  color: #495057; /* Darker text */
  margin-bottom: 0.75rem; /* Increased margin */
  line-height: 1.4; /* Increased line height */
}

.address-details i {
  color: #007bff; /* Highlight icon color */
}

.card-footer {
  padding: 1rem 1.5rem; /* Adjusted padding */
  background: #f1f3f5; /* Lighter footer background */
  border-top: 1px solid #dee2e6;
}

.btn-default {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #6c757d; /* Darker text */
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500; /* Added font weight */
}

.btn-default:hover {
  background: #e9ecef; /* Light hover background */
}

.btn-default.active {
  background: #d4edda; /* Light green active background */
  color: #155724; /* Dark green active text */
  border-color: #c3e6cb; /* Green border */
}

.btn-default i {
  font-size: 1.1rem; /* Icon size */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Even Darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Stronger shadow */
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #343a40; /* Darker heading */
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem; /* Larger close button */
  color: #6c757d; /* Darker icon color */
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #dc3545; /* Red on hover */
}

.address-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem; /* Increased margin */
  color: #343a40; /* Darker label color */
  font-weight: 500;
  font-size: 1rem; /* Adjusted font size */
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.8rem 1rem; /* Adjusted padding */
  border: 1px solid #ced4da; /* Slightly darker border */
  border-radius: 8px;
  font-size: 1rem;
  color: #495057; /* Darker text color */
}

.form-group input::placeholder {
  color: #adb5bd; /* Placeholder color */
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff; /* Highlight border on focus */
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Added focus shadow */
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-btn {
  padding: 0.8rem 1.2rem; /* Adjusted padding */
  border: 1px solid #ced4da; /* Border color */
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500; /* Added font weight */
  color: #495057; /* Text color */
}

.type-btn:hover {
  background: #e9ecef; /* Light hover background */
}

.type-btn.active {
  background: #cfe2ff; /* Light blue active background */
  color: #084298; /* Dark blue active text */
  border-color: #084298; /* Dark blue border */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #6c757d; /* Darker border */
  background: #fff;
  color: #495057; /* Darker text */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500; /* Added font weight */
}

.btn-cancel:hover {
  background: #e9ecef; /* Light hover background */
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: #28a745; /* Green submit button */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500; /* Added font weight */
}

.btn-submit:hover {
  background: #218838; /* Darker green hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2); /* Added shadow on hover */
}

.delete-confirm {
  max-width: 400px;
}

.modal-body {
  padding: 1.5rem;
}

.address-preview {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #dee2e6; /* Added border */
  color: #495057; /* Darker text for preview */
}

.btn-delete {
  background: #dc3545; /* Red delete button */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500; /* Added font weight */
}

.btn-delete:hover {
  background: #c82333; /* Darker red hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2); /* Added shadow on hover */
}

@media (max-width: 768px) {
  .addresses-section {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .type-selector {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style> 
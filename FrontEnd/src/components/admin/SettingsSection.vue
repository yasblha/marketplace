<template>
  <div class="p-6 bg-white rounded shadow max-w-xl">
    <h2 class="text-xl font-bold mb-6">Paramètres du site</h2>

    <!-- Loader -------------------------------------------------------->
    <div v-if="isLoading" class="flex items-center gap-2 text-gray-500 mb-4">
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" />
      </svg>
      Chargement…
    </div>

    <!-- Formulaire ---------------------------------------------------->
    <form v-if="!isLoading" @submit.prevent="onSave" class="space-y-5">
      <FormField label="Email d’alerte">
        <input v-model="settings.alertEmail" type="email" class="input" required />
      </FormField>

      <FormField label="Taux de TVA (%)">
        <input v-model.number="settings.vatRate" type="number" min="0" max="100" step="0.1" class="input" />
      </FormField>

      <FormField label="Seuil stock bas">
        <input v-model.number="settings.lowStockThreshold" type="number" min="1" class="input" />
      </FormField>

      <FormField label="Activer les alertes email" check>
        <input v-model="settings.enableEmailAlerts" type="checkbox" />
      </FormField>

      <FormField label="Activer la réservation panier" check>
        <input v-model="settings.enableCartReservation" type="checkbox" />
      </FormField>

      <FormField label="Nom du site">
        <input v-model="settings.siteName" type="text" class="input" />
      </FormField>

      <FormField label="Message de maintenance">
        <textarea v-model="settings.maintenanceMessage" rows="3" class="input resize-y" />
      </FormField>

      <FormField label="Clé publique Stripe">
        <input :value="settings.stripePublicKey" type="text" class="input bg-gray-100" disabled />
      </FormField>

      <!-- Bouton & messages ------------------------------------------->
      <button class="btn-primary disabled:opacity-50" :disabled="isLoading || !hasChanged">
        Enregistrer
      </button>

      <p v-if="success" class="text-green-600 mt-2">Paramètres enregistrés !</p>
      <p v-if="error"   class="text-red-600 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, toRefs, watch, defineComponent, h } from 'vue'
import { useSettingsStore } from '@/stores/Settings'

/* ---------- Sous-composant FormField (sans JSX) -------------------- */
const FormField = defineComponent({
  name: 'FormField',
  props: {
    label: { type: String,  required: true },
    check: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return () =>
        h(
            'div',
            { class: props.check ? 'flex items-center gap-2' : 'mb-4' },
            [
              h(
                  'label',
                  { class: props.check ? 'font-semibold' : 'block font-semibold mb-1' },
                  props.label
              ),
              slots.default ? slots.default() : null
            ]
        )
  }
})

/* ---------- Pinia store ------------------------------------------- */
const store = useSettingsStore()
const { settings, isLoading, error, success } = toRefs(store)

/* ---------- Détection de modification ----------------------------- */
let initialSnapshot = ''
const setSnapshot   = () => { initialSnapshot = JSON.stringify(settings.value) }
const hasChanged     = computed(() => JSON.stringify(settings.value) !== initialSnapshot)

/* ---------- Actions ------------------------------------------------ */
const onSave = async () => {
  await store.saveSettings()
  if (!store.error) setSnapshot()
}

/* ---------- Chargement initial & watchers ------------------------- */
onMounted(async () => {
  await store.fetchSettings()
  setSnapshot()
})

watch(success, v => { if (v) setTimeout(() => (store.success = false), 3000) })
</script>

<style scoped>
.input       { @apply w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500; }
.btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition; }
</style>

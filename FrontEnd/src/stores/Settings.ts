import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/services/api'

export interface Settings {
  alertEmail: string
  vatRate: number
  lowStockThreshold: number
  enableEmailAlerts: boolean
  enableCartReservation: boolean
  siteName: string
  maintenanceMessage: string
  stripePublicKey: string
}

export const useSettingsStore = defineStore('settings', () => {
  const settings  = ref<Settings>({
    alertEmail: '',
    vatRate: 20,
    lowStockThreshold: 5,
    enableEmailAlerts: true,
    enableCartReservation: false,
    siteName: '',
    maintenanceMessage: '',
    stripePublicKey: ''
  })

  const isLoading = ref(false)
  const error     = ref<string>('')   // chaîne vide si pas d’erreur
  const success   = ref(false)

  const fetchSettings = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const { data } = await axios.get('/settings')
      Object.assign(settings.value, data)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors du chargement'
    } finally {
      isLoading.value = false
    }
  }

  const saveSettings = async () => {
    isLoading.value = true
    error.value = ''
    success.value = false
    try {
      await axios.put('/settings', settings.value)
      success.value = true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Erreur lors de l’enregistrement'
    } finally {
      isLoading.value = false
    }
  }

  return { settings, isLoading, error, success, fetchSettings, saveSettings }
})

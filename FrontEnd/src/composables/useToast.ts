import { useToast as useVueToast } from "vue-toastification";

/**
 * Hook personnalisé pour gérer les notifications toast
 */
export function useToast() {
  const toast = useVueToast();

  /**
   * Affiche un message toast
   * @param message Le message à afficher
   * @param type Le type de toast (success, error, warning, info)
   * @param timeout Durée d'affichage en ms (optionnel)
   */
  const showToast = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    timeout: number = 5000
  ) => {
    switch (type) {
      case 'success':
        toast.success(message, { timeout });
        break;
      case 'error':
        toast.error(message, { timeout });
        break;
      case 'warning':
        toast.warning(message, { timeout });
        break;
      case 'info':
      default:
        toast.info(message, { timeout });
        break;
    }
  };

  return { showToast };
}

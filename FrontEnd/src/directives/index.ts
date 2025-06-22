import type { App } from 'vue';
import clickOutside from './clickOutside';

const directives = {
  install(app: App) {
    app.directive('click-outside', clickOutside);
  },
};
export default directives;

// Export individuel pour l'import nommé
export { clickOutside };

import type { DirectiveBinding, ObjectDirective } from 'vue';

type ClickOutsideHandler = (event: MouseEvent) => void;

declare module 'vue' {
  interface HTMLAttributes {
    onClickOutside?: ClickOutsideHandler;
  }
}

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: MouseEvent) => void;
}

const clickOutside: ObjectDirective<HTMLElement, ClickOutsideHandler> = {
  beforeMount(el: ClickOutsideElement, binding: DirectiveBinding<ClickOutsideHandler>) {
    // Vérifie que la valeur liée est une fonction
    if (typeof binding.value !== 'function') {
      const componentName = binding.instance?.$options?.name || 'UnnamedComponent';
      console.warn(`[v-click-outside] Provided expression must be a function (${componentName})`);
      return;
    }

    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    // Ajoute l'écouteur d'événement
    document.addEventListener('click', el.clickOutsideEvent, { capture: true });
  },

  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent, { capture: true });
      delete el.clickOutsideEvent;
    }
  },
};

export default clickOutside;

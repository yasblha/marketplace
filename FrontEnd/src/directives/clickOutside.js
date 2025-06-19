const clickOutside = {
  beforeMount(el, binding) {
    // Define the click handler
    el.clickOutsideEvent = (event) => {
      // Check if the clicked element is neither the element
      // to which the directive is bound nor a child of it
      if (!(el === event.target || el.contains(event.target))) {
        // Call the provided method
        binding.value(event);
      }
    };
    // Add event listener when the element is mounted
    document.addEventListener('click', el.clickOutsideEvent);
  },
  
  unmounted(el) {
    // Remove event listener when the element is unmounted
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

export default clickOutside;

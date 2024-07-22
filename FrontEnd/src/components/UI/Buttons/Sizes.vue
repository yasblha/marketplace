<template>
    <div class="sizes">
      <span>sizes</span>
      <div class="buttonsSize">
        <button v-for="size in sizes" :key="size" :class="{ active: activeButton === size }"
                @click="setActiveButton(size)" class="size-button">
          {{ size }}
        </button>
      </div>
    </div>
  </template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Sizes',
  setup() {
    const sizes = ['S', 'M', 'L'];
    const activeButton = ref<string | null>(null);

    const setActiveButton = (size: string) => {
      activeButton.value = size;
    };

    return {
      sizes,
      activeButton,
      setActiveButton
    };
  }
});
</script>
<style scoped>
div.sizes {
    display: flex;
    flex-direction: column;
    margin-top: 12px;

}

div.sizes span {

    color: grey;
    margin-bottom: 9px;

}

div.sizes div {
    display: flex;
}

div.sizes div button {
    list-style: none;
    border: 1px solid black;
    width: 9%;
    font-size: 11px;
    padding: 8px;
    text-align: center;
    margin-left: 4px;
    font-weight: 700;
    height: 34px;
    background: white;
    cursor: pointer;
}

.size-button.active {
    background-color: black;
    color: white;
}
</style>
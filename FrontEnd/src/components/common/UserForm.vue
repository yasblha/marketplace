<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="formData.firstName" required>
    </div>
    <div>
      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="formData.lastName" required>
    </div>
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="formData.email" required>
    </div>
    <div>
      <label for="role">Role:</label>
      <input type="text" id="role" v-model="formData.role" required>
    </div>
    <button type="submit">Save</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserFormProps {
  initialData?: Partial<User>;
}

const props = defineProps<UserFormProps>();
const emit = defineEmits(['user-added', 'user-updated']);
const formData = ref<Partial<User>>({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
});

watchEffect(() => {
  if (props.initialData) {
    formData.value = { ...props.initialData };
  }
});

const submitForm = () => {
  if (props.initialData?.id) {
    emit('user-updated', formData.value);
  } else {
    emit('user-added', formData.value);
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

input {
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>


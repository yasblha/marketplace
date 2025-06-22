<template>
  <div class="border-b border-gray-200 bg-white px-4 py-3">
    <!-- Fil d’Ariane -->
    <nav class="flex flex-wrap items-center gap-2 text-sm text-gray-500">
      <RouterLink
          v-for="(c,i) in crumbs"
          :key="i"
          :to="c.path"
          class="flex items-center gap-1 hover:text-blue-600">
        <span>{{ c.name }}</span>
        <span v-if="i < crumbs.length-1" class="mx-1 text-gray-300">/</span>
      </RouterLink>
    </nav>

    <!-- Barre de recherche -->
    <div class="mt-3 flex items-center gap-2">
      <input
          v-model="query"
          :placeholder="props.placeholder"
          @keyup.enter="doSearch"
          class="flex-1 rounded-lg border px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      <button @click="doSearch"
              class="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
        <i class="fas fa-search" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, type RouteRecordNormalized } from 'vue-router'

/* ─── props / emits ─── */
const props = withDefaults(defineProps<{
  placeholder?: string
  debounce?:    number
}>(), {
  placeholder: 'Rechercher un produit…',
  debounce:    300
})

const emit = defineEmits<{ (e:'search', q:string):void }>()

const route  = useRoute()
const router = useRouter()

const crumbs = computed(() =>
    route.matched
        .filter(r => r.meta?.breadcrumb !== false)      // masquable via meta
        .map((r:RouteRecordNormalized) => ({
          name : r.meta?.breadcrumb ?? r.meta?.title ?? r.name ?? '…',
          path : r.path === '' ? '/' : r.path
        }))
)

//champ de recherche
const query = ref('')

let t: ReturnType<typeof setTimeout> | null = null
watch(query, q => {
  if (t) clearTimeout(t)
  t = setTimeout(() => emit('search', q.trim()), props.debounce)
})

const doSearch = () => emit('search', query.value.trim())
</script>

<style scoped>
</style>

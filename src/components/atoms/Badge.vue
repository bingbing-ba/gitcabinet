<template>
  <span class="badge">{{ content }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  setup() {
  },
})
</script>

<style scoped>
.badge {
  @apply inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-700 rounded;
}
</style>
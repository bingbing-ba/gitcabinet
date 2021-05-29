<template>
  <span class="badge" :class="`bg-${color}-500 text-${color}-100`">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    content: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'indigo'
    }
  },
  setup() {
  },
})
</script>

<style scoped>
.badge {
  @apply inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded;
}
</style>
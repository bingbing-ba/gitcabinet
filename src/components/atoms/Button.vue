<template>
  <button
    class="btn"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
  },
  setup() {
  },
})
</script>

<style>
.btn {
  @apply py-2 px-4 leading-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-75;
}
</style>

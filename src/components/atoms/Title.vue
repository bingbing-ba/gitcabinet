<template>
  <div class="gct-font">
    <slot></slot>
  </div>
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
.gct-font {
  @apply font-extrabold text-2xl text-indigo-700;
}
</style>

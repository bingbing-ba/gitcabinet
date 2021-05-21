<template>
  <div class="section__right">
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
.section__right {
  @apply grid grid-rows-2 gap-y-3 py-7 px-4 overflow-auto;
}
</style>

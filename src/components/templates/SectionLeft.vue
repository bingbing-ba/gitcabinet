<template>
  <div class="section__left">
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
.section__left {
  @apply grid grid-rows-2 auto-cols-fr gap-y-3 py-7 px-4;
}
</style>

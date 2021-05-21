<template>
  <div class="box">
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
.box {
  @apply w-full min-w-full border-2 border-black;
}
</style>

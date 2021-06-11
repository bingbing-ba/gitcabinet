<template>
  <div class="message-box" :class="`bg-${color}-300 border-${color}-500`">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  props: {
    color: {
      type: String,
      default: 'red'
    }
  },
  setup() {
  },
})
</script>

<style scoped>
.message-box {
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left-width: 0.4rem;
  @apply rounded font-semibold text-white;
}
</style>

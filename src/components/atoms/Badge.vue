<template>
  <span class="badge" :class="[bgColor, textColor]">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: {
    content: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'indigo'
    },
    textColor: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const bgColor = computed(() => {
      return `bg-${props.color}-600`
    })
    const textColor = computed(() => {
      return props.textColor ? `text-${props.textColor}` : `text-${props.color}-100`
    })
    
    return {
      bgColor,
      textColor,
    }
  },
})
</script>

<style scoped>
.badge {
  @apply inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded;
}
</style>
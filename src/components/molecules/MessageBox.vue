<template>
  <div class="message-box" :class="`bg-${color}-300 border-${color}-500`">
    <slot></slot>
    <IconX class="absolute right-5 cursor-pointer hover:text-white" :class="`text-${color}-500`" @click="toggleViewStatus"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IconX } from '@/components'

export default defineComponent({
  components: {
    IconX
  },
  props: {
    color: {
      type: String,
      default: 'red'
    }
  },
  setup(props, { emit }) {
    const toggleViewStatus = () => {
      emit('toggle-view-status')
    }
    return {
      toggleViewStatus
    }
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
  position: absolute;
  bottom: 0;
  @apply rounded font-semibold text-white;
}
</style>

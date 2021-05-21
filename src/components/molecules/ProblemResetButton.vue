<template>
  <Button class="btn-reset">
    <IconRefresh/>
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, IconRefresh } from '@/components'

export default defineComponent({
  components: {
    Button,
    IconRefresh,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
.btn-reset {
  @apply bg-blue-200 flex items-center justify-center rounded-full h-12 w-12 self-stretch px-2 mx-2 text-white focus:ring-0 transform hover:rotate-180 hover:bg-blue-300 transition focus:ring-4 focus:ring-red-200 focus:ring-opacity-75;
}
</style>

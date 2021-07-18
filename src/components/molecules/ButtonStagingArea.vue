<template>
  <Button class="navbar__btn">
    <IconChart/>
    Staging Area
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, IconChart } from '@/components'

export default defineComponent({
  components: {
    Button,
    IconChart,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
.navbar__btn {
  @apply flex align-middle items-center border-2 border-gray-500;
}
</style>

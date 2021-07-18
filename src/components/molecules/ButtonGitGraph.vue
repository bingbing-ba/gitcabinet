<template>
  <Button class="navbar__btn">
    <IconGraph/>
    커밋 그래프
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, IconGraph } from '@/components'

export default defineComponent({
  components: {
    Button,
    IconGraph,
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

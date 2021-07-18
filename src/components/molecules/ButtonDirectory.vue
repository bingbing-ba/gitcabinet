<template>
  <Button class="navbar__btn">
    <IconFolder/>
    디렉토리
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, IconFolder } from '@/components'

export default defineComponent({
  components: {
    Button,
    IconFolder,
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

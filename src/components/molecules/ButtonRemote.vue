<template>
  <Button class="navbar__btn">
    <IconCloud/>
    원격 저장소
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, IconCloud } from '@/components'

export default defineComponent({
  components: {
    Button,
    IconCloud,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
.navbar__btn {
  @apply flex align-middle items-center;
}
</style>

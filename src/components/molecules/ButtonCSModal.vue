<template>
  <Button class="cs-button">
    ?
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from '@/components'

export default defineComponent({
  components: {
    Button,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
.cs-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  border-radius: 2rem;
}
</style>

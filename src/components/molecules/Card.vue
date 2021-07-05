<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, Title, Box } from '@/components'

export default defineComponent({
  components: {
    Button,
    Title,
    Box,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
</style>

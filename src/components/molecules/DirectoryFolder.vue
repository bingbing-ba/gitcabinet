<template>
  <div class="flex">
    <IconFolder/> {{ dirName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IconFolder } from '@/components'

export default defineComponent({
  components: {
    IconFolder
  },
  props: {
    dirName: {
      type: String
    }
  },
  setup() {
  },
})
</script>

<style>
</style>

<template>
  <div class="edge-line"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
  },
  setup() {
  },
})
</script>

<style scoped>
.edge-line{
  height: 1px;
  width: 60px;
  border: 2px solid black;
  background-color: black;
}
</style>
<template>
  <div class="circle"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  setup() {
  },
})
</script>

<style scoped>
.circle {
  width: 50px;
  height: 50px;
  border: 4px solid black;
  border-radius: 50%;
  animation: createNode 2s ease-in;
}

@keyframes createNode {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
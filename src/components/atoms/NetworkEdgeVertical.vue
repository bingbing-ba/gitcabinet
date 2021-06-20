<template>
  <div class="edge">
    <div class="edge-head-left"></div>
    <div class="edge-line"></div>
    <div class="edge-head-right"></div>
  </div>
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
.edge {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  animation: createEdge 3s;
}

@keyframes createEdge {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.edge-head-left {
  height: 12px;
  width: 1px;
  border: 2px solid black;
  background-color: black;
  transform: rotate(30deg);
}

.edge-head-right {
  height: 12px;
  width: 1px;
  border: 2px solid black;
  background-color: black;
  transform: rotate(-30deg);
}

.edge-line{
  height: 60px;
  width: 1px;
  border: 2px solid black;
  background-color: black;
}
</style>
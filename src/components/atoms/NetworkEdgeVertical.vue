<template>
  <div class="container">
    <div class="edge">
      <div class="edge-head-left"></div>
      <div class="edge-line"></div>
      <div class="edge-head-right"></div>
    </div>
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
.container {
  width: 100%;
  height: 60px;
  overflow: hidden;
}

.edge {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  animation: createEdge 1s;
}

@keyframes createEdge {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}

.edge-head-left {
  height: 12px;
  width: 1px;
  border: 2px solid black;
  background-color: black;
  transform: rotate(30deg) translateX(1px);
}

.edge-head-right {
  height: 12px;
  width: 1px;
  border: 2px solid black;
  background-color: black;
  transform: rotate(-30deg) translateX(-1px);
}

.edge-line{
  height: 60px;
  width: 1px;
  border: 2px solid black;
  background-color: black;
}
</style>
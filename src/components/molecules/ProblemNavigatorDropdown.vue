<template>
  <div class="p-navi-dropdown">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
  },
})
</script>

<style scoped>
.p-navi-dropdown {
  height: 130px;
  width: 160px;
  top: 68px;
  margin-top: 12px;
  margin-left: 52px;
  @apply absolute bg-gray-500 text-white p-3 flex flex-wrap justify-between
    content-center rounded shadow-2xl;
}

.p-navi-dropdown::after {
  content: '';
  position: absolute;
  top: -12px;
  left: calc(50% - 12px);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid rgba(100, 116, 139, var(--tw-bg-opacity));
}
</style>
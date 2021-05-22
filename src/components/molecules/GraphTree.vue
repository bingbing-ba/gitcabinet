<template>
  <!-- vertical -->
  <div class="flex flex-col overflow-y-auto overflow-x-hidden text-gray-900 w-100 p-5 graph-container">
    <div 
      v-for="(commit, idx) in commits" 
      :key="commit.hash" 
      class="flex flex-col items-center graph-node">
      <GraphNode :commit="commit" />
      <div v-if="idx !== commits.length - 1" class="graph-edge">
        <div class="edge-line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { GraphNode } from '@/components'
import { commit } from '@/git/gitTypes'

export default defineComponent({
  components: {
    GraphNode
  },
  props: {
    commits: {
      type: Object as PropType<commit & {hash: string}>
    }
  },
  setup() {
    return {
    }
  },
})
</script>

<style scoped>
/* 상위 요소에 width & height가 없음 */
.graph-container {
  height: 300px;
  width: 600px;
}

.graph-node {
  width: 100px;
}

.graph-edge {
  height: 50px;
  width: 100px;
  display: flex;
  justify-content: center;
}

.edge-line{
  height: 50px;
  width: 1px;
  border: 2px solid black;
}
</style>
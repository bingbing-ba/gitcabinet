<template>
  <div class="graph-tree">
    <div v-for="(commit, idx) in commits" :key="commit.hash" class="graph-node">
      <GraphNode :commit="commit" />
      <div v-if="idx !== commits.length - 1" class="graph-edge"></div>
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
.graph-tree {
  display: flex;
}

.graph-node {
  display: flex;
  align-items: center;
}

.graph-edge {
  height: 1px;
  width: 50px;
  border: 2px solid black;
}

</style>
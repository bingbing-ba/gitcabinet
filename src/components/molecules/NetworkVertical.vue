<template>
  <!-- vertical -->
  <div class="py-10">
    <div 
      v-for="(commit, idx) in commits" 
      :key="commit.hash" 
      class="node-box">

      <div class="node-left-box px-5">
        <Badge
          v-if="lastCommitBranch(commit.hash)" 
          :content="lastCommitBranch(commit.hash)"
          class="badge absolute" />
        <NetworkNode />
        <NetworkEdge v-if="idx !== commits.length - 1"/>
      </div>

      <div class="node-right-box">
        <NetworkDetail :commit="commit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { NetworkNode, NetworkEdge, NetworkDetail, Badge } from '@/components'
import { commit } from '@/git/gitTypes'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    NetworkNode,
    NetworkEdge,
    NetworkDetail,
    Badge
  },
  props: {
    git: {
      type: Git
    },
    commits: {
      type: Object as PropType<commit & {hash: string}>
    }
  },
  setup(props) {
    const lastCommitBranch = (commitHash: string) => {
      for (let branch in props.git?.branches) {
        if (commitHash === props.git?.branches[branch]) {
          return branch
        }
      }
      return ''
    }

    return {
      lastCommitBranch
    }
  },
})
</script>

<style scoped>
/* 상위 요소에 width & height가 없음 */
.graph-container {
  width: 600px;
}

.node-box {
  display: flex;
}

.node-left-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.badge {
  top: -20px;
  left: 50px;
}
</style>
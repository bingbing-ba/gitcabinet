<template>
  <div class="py-10">
    <div 
      v-for="(commit, idx) in commits" 
      :key="commit.hash" 
      class="node-box">

      <div class="node-left-box px-5">
        <Badge
          v-if="lastCommitBranch(commit.hash)"
          class="badge absolute">
          {{ lastCommitBranch(commit.hash) }}
        </Badge>
        <NetworkNode />
        <NetworkEdgeVertical v-if="idx !== commits.length - 1"/>
      </div>

      <div class="node-right-box">
        <NetworkDetail :commit="commit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { NetworkNode, NetworkEdgeVertical, NetworkDetail, Badge } from '@/components'
import { commit } from '@/git/gitTypes'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    NetworkNode,
    NetworkEdgeVertical,
    NetworkDetail,
    Badge
  },
  props: {
    git: {
      type: Git
    },
    commits: {
      type: Array as PropType<Array<commit & {hash: string}>>
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
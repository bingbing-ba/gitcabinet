<template>
  <div class="network-container p-10">
    <div 
      v-for="(commit, idx) in reverseCommits" 
      :key="commit.hash" 
      class="node-box">

      <div class="node-left-box">
        <Badge
          v-if="lastCommitBranch(commit.hash)" 
          :content="lastCommitBranch(commit.hash)"
          class="badge absolute" />
        <NetworkNode />
      </div>
      <div class="node-right-box">
        <NetworkEdgeHorizontal v-if="idx !== commits.length - 1"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { NetworkNode, NetworkEdgeHorizontal, Badge } from '@/components'
import { commit } from '@/git/gitTypes'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    NetworkNode,
    NetworkEdgeHorizontal,
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

    const reverseCommits = computed(() => {
      const newArray: commit[] = []
      // for (let i = props.commits?.length || 0; i > 0; i--) {
      //   newArray.push(props.commits![i])
      // }
      props.commits?.forEach(commit => {
        newArray.unshift(commit)
      })
      return newArray
    })

    return {
      lastCommitBranch,
      reverseCommits
    }
  },
})
</script>

<style scoped>
.network-container {
  display: flex;
  align-items: center;
}

.node-box {
  display: flex;
}

.node-left-box {
  display: flex;
  align-items: center;
  position: relative;
}

.node-right-box {
  display: flex;
  align-items: center;
}

.badge {
  top: -20px;
  left: 50px;
}
</style>
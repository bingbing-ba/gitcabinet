<template>
  <div class="graph-node">

  </div>
  <!-- <p>
    {{ commit.message }}
    {{ commit.hash }}
  </p> -->
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { commit } from '@/git/gitTypes'

export default defineComponent({
  components: {
  },
  props: {
    commit: {
      type: Object as PropType<commit & {hash: string}>
    }
  },
  setup(props) {
    // props.commit?.hash
    return {
      
    }
  },
})
</script>

<style scoped>
.graph-node {
  width: 50px;
  height: 50px;
  border: 4px solid black;
  border-radius: 50%;
}
</style>
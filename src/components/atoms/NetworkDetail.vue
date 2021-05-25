<template>
  <div class="content">
    <p>{{ commit.hash }}</p>
    <!-- <p>{{ shortHash }}</p> -->
    <p>Date : {{ date }}</p>
    <p>
      {{ commit.message }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { commit } from '@/git/gitTypes'

export default defineComponent({
  props: {
    commit: {
      type: Object as PropType<commit & {hash: string}>
    }
  },
  setup(props) {
    const date = computed(() => {
      const dateInstance = new Date(Number(props.commit?.createdAt))
      return dateInstance.toString()
    })

    const shortHash = computed(() => {
      return props.commit?.hash.slice(0, 7)
    })
    
    return {
      date,
      shortHash
    }
  },
})
</script>

<style>
.edge-line{
  height: 60px;
  width: 1px;
  border: 2px solid black;
}
</style>
<template>
  <div class="node-container">
    <div class="circle">
    </div>
    <div class="content">
      <p>{{ commit.hash }}</p>
      <!-- <p>{{ shortHash }}</p> -->
      <p>Date : {{ date }}</p>
      <p>
        {{ commit.message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { commit } from '@/git/gitTypes'

export default defineComponent({
  components: {
  },
  props: {
    commit: {
      type: Object as PropType<commit & {hash: string}>
    }
  },
  created() {
    console.log(this.commit)
  },
  setup(props) {
    const date = computed(() => {
      const unixTime = props.commit?.author.slice(props.commit?.author.length - 13)
      const dateInstance = new Date(Number(unixTime))
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

<style scoped>
.node-container {
  width: 100px;
  display: flex;
  justify-content: center;
  position: relative;
}

.circle {
  width: 50px;
  height: 50px;
  border: 4px solid black;
  border-radius: 50%;
}

.content {
  position: absolute;
  top: 0;
  left: 100px;
  width: 500px;
}
</style>
<template>
  <div class="content">
    <!-- <p>{{ commit.hash }}</p> -->
    <p>{{ shortHash }} : {{ commit.message }}</p>
    <p>{{ date }}</p>
    <p>{{ commit.author.name }} | {{ commit.author.email }}</p>
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
      const fullYear = dateInstance.getFullYear()
      const month = dateInstance.getMonth()
      const date = dateInstance.getDate()
      const hours = dateInstance.getHours()
      const minutes = dateInstance.getMinutes()
      const seconds = dateInstance.getSeconds()
      const day = ['일', '월', '화', '수', '목', '금', '토'][dateInstance.getDay()]

      return `${fullYear}년 ${month}월 ${date}일 (${day}) ${hours}시 ${minutes}분 ${seconds}초`
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
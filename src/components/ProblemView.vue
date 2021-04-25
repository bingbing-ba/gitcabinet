<template>
  <div>
    <h1>{{ problem.title }}</h1>
    <p>{{ problem.content }}</p>
    <p>{{ problem.hint }}</p>
    <button :class="isCorrect ? 'success' : 'disabled'">다음문제</button>
  </div>
</template>

<script lang="ts">
import { Problem } from '@/problems/problem'
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const isCorrect = computed(()=>{
      return props.problem.isCorrect()
    })
    return {
      isCorrect,
    }
  },
})
</script>

<style>
.disabled{
  cursor: initial;
  background-color: gray;
}
.success{
  cursor: pointer;
  background-color: green;
}
</style>

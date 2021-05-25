<template>
  <div>
    <h1>{{ problem.title }}</h1>
    <p>{{ problem.content }}</p>
    <p>{{ problem.hint }}</p>
    <button 
      :class="isCorrect ? 'success' : 'disabled'"
      @click="nextProblem"
    >
      다음문제
    </button>
  </div>
</template>

<script lang="ts">
import { Problem } from '@/problem/problem'
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isCorrect = computed(()=>{
      return props.problem.isCorrect()
    })
    const nextProblem = () => {
      if (isCorrect.value) {
        emit('next-problem')
      }
    }
    return {
      isCorrect,
      nextProblem,
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

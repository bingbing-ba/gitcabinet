<template>
  <Button class="btn-reset" @click="resetProblem">
    <IconRefresh/>
  </Button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Problem } from '@/problems/problem'
import { Button, IconRefresh } from '@/components'

export default defineComponent({
  components: {
    Button,
    IconRefresh,
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props, { emit }) {
    const problem = props.problem

    const resetProblem = () => {
      emit('reset-problem', problem)
    }
    return {
      resetProblem,
    }
  },
})
</script>

<style>
.btn-reset {
  @apply bg-blue-200 flex items-center justify-center rounded-full h-12 w-12 self-stretch px-2 mx-2 text-white focus:ring-0 transform hover:rotate-180 hover:bg-blue-300 transition focus:ring-4 focus:ring-red-200 focus:ring-opacity-75;
}
</style>

<template>
  <div class="problem__instruction">
    <Title class="problem__instruction-title">
      {{ problem.title }}
    </Title>
    <Card class="problem__instruction-content">
      <p v-html="wrapCodesInProblemContent"></p>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'
import { Problem } from '@/problems/problem'
import { Title, Card } from '@/components'

export default defineComponent({
  components: {
    Title,
    Card
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const { problem } = toRefs(props)

    const wrapCodesInProblemContent = computed(() => {
      let problemContent = problem.value.content
      const pattern = new RegExp('\\*\\$.+?\\*', 'g')
      const matchList = problemContent?.match(pattern)
      
      let result = problemContent
      matchList?.forEach((code) => {
        const codeAsteriskRemoved = code.slice(1, code.length-1)
        const codeDecorated = `<code class="problem__content-code">${codeAsteriskRemoved}</code>`
        result = result?.replace(code, codeDecorated)
      })
      return result
    })

    return {
      wrapCodesInProblemContent,
    }
  },
})
</script>

<style>
.problem__instruction {
  @apply bg-white rounded-md p-5 px-5 overflow-auto shadow-xl;
}

.problem__instruction::-webkit-scrollbar {
  width: 10px !important;
}
.problem__instruction::-webkit-scrollbar-thumb {
  background-color: #2f3542 !important;
}
.problem__instruction::-webkit-scrollbar-track {
  background-color: grey !important;
}

.problem__instruction-title {
  @apply my-3 text-gray-800 font-extrabold text-3xl;
}

.problem__instruction-content {
  @apply font-normal text-gray-700 whitespace-normal leading-loose break-words;
}

.problem__content-code {
  @apply text-indigo-500 py-1 px-2 m-0 text-base font-bold bg-gray-200 rounded;
}
</style>

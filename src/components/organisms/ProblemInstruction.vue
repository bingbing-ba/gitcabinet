<template>
  <div class="problem__instruction">
    <Title class="problem__instruction-title">
      {{ problem.title }}
    </Title>
    <Card class="problem__instruction-content">
      <p v-html="wrapCodesInProblemContent"></p>
    </Card>
    <br>
    <Card class="problem__instruction-content">
      <p v-html="wrapCodesInProblemExplanation"></p>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'
import { Problem } from '@/problem'
import { Title, Card } from '@/components'

export default defineComponent({
  components: {
    Title,
    Card,
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const { problem } = toRefs(props)

    const wrapCodesInProblem = (paragraph: string | undefined) => {
      if (!paragraph) {
        return ''
      }
      const pattern = new RegExp('\\*\\$.+?\\*', 'g')
      const matchList = paragraph?.match(pattern)

      let result = paragraph
      matchList?.forEach((code) => {
        const codeAsteriskRemoved = code.slice(1, code.length - 1)
        const codeDecorated = `<code class="problem__content-code">${codeAsteriskRemoved}</code>`
        result = result?.replace(code, codeDecorated)
      })
      result = result.replace(/\n/g, '<br>')

      const boldPattern = /\*.*?\*/g
      const boldMatchList = result.match(boldPattern)
      boldMatchList?.forEach((bold)=> {
        const asteriskRemoved = bold.slice(1, bold.length -1)
        const boldDecorated = `<span style="font-weight:900;color:#ff6103">${asteriskRemoved}</span>`
        result = result.replace(bold, boldDecorated)
      })

      return result
    }

    const wrapCodesInProblemContent = computed(() =>
      wrapCodesInProblem(problem.value.content)
    )

    const wrapCodesInProblemExplanation = computed(() =>
      wrapCodesInProblem(problem.value.explanation)
    )

    return {
      wrapCodesInProblemContent,
      wrapCodesInProblemExplanation,
    }
  },
})
</script>

<style>
.problem__instruction {
  @apply bg-white rounded-md p-5 px-5 overflow-auto shadow-xl;
}

.problem__instruction::-webkit-scrollbar {
  @apply bg-white w-3 rounded;
}

.problem__instruction::-webkit-scrollbar-corner {
  @apply bg-gray-900 rounded;
}

.problem__instruction::-webkit-scrollbar-corner {
  @apply bg-gray-900 rounded;
}

.problem__instruction::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded w-2 mt-3;
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

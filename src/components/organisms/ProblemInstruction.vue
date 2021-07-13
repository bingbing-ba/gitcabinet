<template>
  <div class="problem__instruction">
    <Title class="problem__instruction-title">
      {{ problem.title }}
    </Title>
    <Card class="problem__instruction-content">
      <WrapCode :text="content" />
    </Card>
    <br />
    <Badge textColor="white">설명</Badge>
    <Card class="problem__instruction-explanation">
      <WrapCode :text="explanation" />
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'
import { Problem } from '@/problem'
import { Title, Card, Badge } from '@/components'
import WrapCode from '@/components/jsx/WrapCode'

export default defineComponent({
  components: {
    Title,
    Card,
    Badge,
    WrapCode,
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const { problem } = toRefs(props)

    const content = computed(() => {
      return props.problem.content
    })
    const explanation = computed(() => props.problem.explanation)

    return {
      content,
      explanation,
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

.problem__instruction-explanation {
  @apply font-light text-gray-500 whitespace-normal leading-loose break-words;
}

.problem__content-code {
  @apply text-indigo-500 py-1 px-2 m-0 text-base font-bold bg-gray-200 rounded;
}

.problem__content-strong {
  color: #ff6103;
  @apply font-bold;
}
</style>

<template>
  <div class="problem__instruction">
    <Title class="my-3 text-gray-800 font-extrabold text-3xl">
      {{ problem.title }}
    </Title>
    <Card class="text-normal whitespace-normal leading-loose break-words">
      <p>{{ problem.content }}</p>
      <p>{{ problem.hint }}</p>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Problem } from '@/problem/problem'
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
  setup() {
  },
})
</script>

<style>
.problem__instruction {
  @apply bg-white rounded-md p-5 px-5 overflow-y-scroll shadow-xl;
}
</style>

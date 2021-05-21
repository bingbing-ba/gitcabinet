<template>
  <div class="git-graph">
    <div class="bg-gray-200">
      <Title class="git-graph__text">
        커밋 그래프
      </Title>
    </div>
    <Card class="p-2">
      TEST
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Title, Card } from '@/components'

export default defineComponent({
  components: {
    Title,
    Card,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
.git-graph {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow;
}

.git-graph__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

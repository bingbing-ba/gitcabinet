<template>
  <div class="git-staging-area">
    <div class="bg-gray-200">
      <Title class="git-staging-area__text">
        Staging Area
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-auto overflow-x-hidden max-h-full">
      Staging Area
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Title, Card } from '@/components'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    Title,
    Card,
  },
  props: {
    git: {
      type: Git
    }
  }
})
</script>

<style scoped>
.git-staging-area {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow h-full overflow-hidden;
}

.git-staging-area__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

<template>
  <div class="git-remote">
    <div class="bg-gray-200">
      <Title class="git-remote__text">
        원격 저장소
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-scroll overflow-x-hidden max-h-full">
      원격 저장소
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
  }
})
</script>

<style scoped>
.git-remote {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow h-full overflow-y-auto;
}

.git-remote__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

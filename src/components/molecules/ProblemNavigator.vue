<template>
  <div class="p-navi">
    <Button 
      class="p-navi__left"
      @click="onClickPrevProblem"
    >
      <IconArrowLeft/>
    </Button>
    <div class="stages">
      <Title 
        class='stages__title'
        @click="onClickStages"
      >
        1 of 12
      </Title>
      <div>
        <!-- ...dropdown... -->
      </div>
    </div>
    <Button 
      class="p-navi__right"
      @click="onClickNextProblem"
    >
      <IconArrowRight/>
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, Title, IconArrowLeft, IconArrowRight } from '@/components'

export default defineComponent({
  components: {
    Button,
    Title,
    IconArrowLeft,
    IconArrowRight,
  },
  props: {
  },
  setup() {
  },
})
</script>

<style>
.stages {
  @apply relative flex items-center justify-center p-1 w-44 hover:bg-gray-700 h-full cursor-pointer;
}

.stages__title {
  @apply text-white text-base;
}

.p-navi {
  @apply self-stretch flex ml-auto items-center bg-gray-500 rounded-full;
}

.p-navi__left {
  @apply self-stretch rounded-full shadow-none focus:ring-0 px-3;
}

.p-navi__right {
  @apply self-stretch rounded-full shadow-none focus:ring-0 px-3;
}
</style>

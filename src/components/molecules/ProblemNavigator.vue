<template>
  <div class="p-navi">
    <Button 
      class="p-navi__left"
      @click="gotoPrevProblem"
      :class="{ disabled: index === 1 }"
    > 
      <IconArrowLeft/>
    </Button>
    <div class="stages">
      <Title 
        class='stages__title'
        @click="showStageList"
      >
        {{ index }} of 12
      </Title>
      <div>
        <!-- ...dropdown... -->
      </div>
    </div>
    <Button 
      class="p-navi__right"
      @click="gotoNextProblem"
      :class="{ solved: problem.isCorrect(), disabled: index === lastProblemIndex }"
    >
      <IconArrowRight/>
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, onUpdated } from 'vue'
import { Problem } from '@/problem'
import { Button, Title, IconArrowLeft, IconArrowRight } from '@/components'

export default defineComponent({
  components: {
    Button,
    Title,
    IconArrowLeft,
    IconArrowRight,
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
    problemIndex: {
      type: Number,
      required: true,
    },
    lastProblemIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { problemIndex, lastProblemIndex, problem } = toRefs(props)
    
    const index = computed(() => {
      return problemIndex.value + 1
    })
    
    const showStageList = () => {
    }
    const gotoPrevProblem = () => {
      if (index.value === 1) return
      emit('goto-prev-problem')
    }
    const gotoNextProblem = () => {
      if (index.value === lastProblemIndex.value) return
      emit('goto-next-problem')
    }
    
    return {
      index,
      problem,
      showStageList,
      gotoPrevProblem,
      gotoNextProblem,
    }
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

.solved {
  animation: customPing 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes customPing {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>

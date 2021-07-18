<template>
  <div :class="{'p-navi':true, green:isCorrect}">
    <Button 
      class="p-navi__left"
      @click="gotoPrevProblem"
      :class="{ disabled: index === 1 }"
    > 
      <IconArrowLeft/>
    </Button>
    <div class="stages" @click="showStageList">
      <Title 
        class='stages__title'
      >
        {{ index }} of {{ lastProblemIndex }}
      </Title>
    </div>
    <ProblemNavigatorDropdown v-if="isStageListShown">
      <template
        v-for="(eachPro, idx) in problems"
        :key="eachPro.title"
      >
        <div
          class="p-navi-dropdown__problem" 
          :class="{ 
            'p-navi-dropdown__problem--solved': eachPro.isCorrect(),
            'p-navi-dropdown__problem--current': idx == index - 1
          }"
          @click="gotoTargetProblem(idx)"
        >
          {{ idx + 1 }}
        </div>
      </template>
    </ProblemNavigatorDropdown>
    <Button 
      class="p-navi__right"
      @click="gotoNextProblem"
      :class="{ solved: solved, disabled: index === lastProblemIndex }"
    >
      <IconArrowRight/>
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { Problem } from '@/problem'
import { Button, Title, IconArrowLeft, IconArrowRight, ProblemNavigatorDropdown } from '@/components'

export default defineComponent({
  components: {
    Button,
    Title,
    IconArrowLeft,
    IconArrowRight,
    ProblemNavigatorDropdown,
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
    problems: {
      type: Array,
      required: true,
    },
    isCorrect: {
      type: Boolean,
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

    const index = computed(() => {
      return props.problemIndex + 1
    })
    const solved = computed(() => {
      return props.isCorrect && !(index.value === props.lastProblemIndex)
    })
    
    const isStageListShown = ref(false)
    const showStageList = () => {
      isStageListShown.value = !isStageListShown.value
    }
    const gotoPrevProblem = () => {
      if (index.value === 1) return
      emit('goto-prev-problem')
    }
    const gotoNextProblem = () => {
      if (index.value === props.lastProblemIndex) return
      emit('goto-next-problem')
    }
    const gotoTargetProblem = (idx: number) => {
      showStageList()
      emit('goto-target-problem', idx)
    }

    return {
      index,
      solved,
      showStageList,
      gotoPrevProblem,
      gotoNextProblem,
      gotoTargetProblem,
      isStageListShown,
    }
  },
})
</script>

<style>
.stages {
  width: 160px;
  @apply relative flex items-center justify-center p-1 hover:bg-gray-700 h-full cursor-pointer;
}

.stages__title {
  @apply text-white text-base;
}

.p-navi {
  height: 52px;
  @apply self-stretch flex ml-auto items-center bg-gray-500 rounded-full;
}

.green {
  @apply bg-green-500;
}

.p-navi__left {
  width: 52px;
  height: 52px;
  @apply self-stretch rounded-full shadow-none focus:ring-0 px-3;
}

.p-navi__right {
  width: 52px;
  height: 52px;
  @apply self-stretch rounded-full shadow-none focus:ring-0 px-3;
}

.p-navi-dropdown__problem {
  margin: 4px;
  @apply rounded-full h-7 w-7 shadow-inner bg-white text-black flex justify-center align-middle
    cursor-pointer hover:bg-gray-200;
}


.p-navi-dropdown__problem--current {
  @apply bg-indigo-500 ring-2 ring-red-300 text-white;
}

.p-navi-dropdown__problem--solved {
  @apply bg-green-500 text-white ring-inset ring-4 ring-green-200;
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

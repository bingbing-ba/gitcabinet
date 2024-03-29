<template>
  <div class="navbar">
    <div class="navbar-left">
      <Title><a href="/">GIT CABINET</a></Title>
      <ProblemNavigator
        :problem="problem"
        :problems="problems"
        :isCorrect="isCorrect"
        :problemIndex="problemIndex"
        :lastProblemIndex="lastProblemIndex"
        @goto-prev-problem="gotoPrevProblem"
        @goto-next-problem="gotoNextProblem"
        @goto-target-problem="gotoTargetProblem"
      />
      <ProblemResetButton 
        :problem="problem"
        @reset-problem="resetProblem"
      />
    </div>
    <div class="navbar-right">
      <ButtonDirectory @click="updateViewQueue(0)" :class="{ selected: !viewQueue.includes(0) }"/>
      <ButtonGitGraph @click="updateViewQueue(1)" :class="{ selected: !viewQueue.includes(1) }"/>
      <ButtonStagingArea @click="updateViewQueue(2)" :class="{ selected: !viewQueue.includes(2) }"/>
      <ButtonRemote @click="updateViewQueue(3)" :class="{ selected: !viewQueue.includes(3) }"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { Problem } from '@/problem/'
import { 
  Title, 
  ButtonDirectory,
  ButtonGitGraph,
  ButtonStagingArea,
  ButtonRemote,
  ProblemNavigator, 
  ProblemResetButton, 
} from '@/components'

export default defineComponent({
  components: {
    Title,
    ButtonDirectory,
    ButtonGitGraph,
    ButtonStagingArea,
    ButtonRemote,
    ProblemNavigator,
    ProblemResetButton
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
    viewQueue: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    const { problem } = toRefs(props)

    const resetProblem = () => {
      emit('reset-problem')
    }

    const gotoPrevProblem = () => {
      emit('goto-prev-problem')
    }
    const gotoNextProblem = () => {
      emit('goto-next-problem')
    }
    const gotoTargetProblem = (idx: number) => {
      emit('goto-target-problem', idx)
    }

    const updateViewQueue = (nextViewIndex: number) => {
      emit('update-view-queue', nextViewIndex)
    }

    return {
      problem,
      resetProblem,
      gotoPrevProblem,
      gotoNextProblem,
      gotoTargetProblem,
      updateViewQueue
    }
  },
})
</script>

<style scoped>
.navbar {
  @apply flex flex-wrap justify-between p-4 shadow z-50;
}

.navbar-left {
  @apply lg:w-2/4 flex items-center px-5 w-full;
}

.navbar-right {
  @apply space-x-4 px-5 w-full hidden sm:hidden lg:flex lg:justify-start lg:my-0 lg:w-2/4;
}

.selected {
  @apply text-gray-500 bg-white shadow-none border-gray-500 border-2 hover:bg-gray-300;
}
</style>

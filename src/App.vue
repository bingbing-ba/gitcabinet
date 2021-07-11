<template>
  <TheNavBar
    class="navbar"
    :problem="problem"
    :isCorrect="isCorrect"
    :problemIndex="problemIndex"
    :lastProblemIndex="lastProblemIndex"
    :viewQueue="viewQueue"
    @goto-prev-problem="gotoPrevProblem"
    @goto-next-problem="gotoNextProblem"
    @reset-problem="resetProblem"
    @update-view-queue="updateViewQueue"
  />
  <main class="main">
    <SectionLeft class="overflow-auto">
      <ProblemInstruction :problem="problem" />
      <ProblemCLI
        ref="ProblemCLI"
        :problem="problem"
        :hasReset="hasReset"
        @undo-reset="undoReset"
      />
    </SectionLeft>
    <SectionRight>
      <div class="overflow-hidden">
        <transition name="first-card">
          <component
            :is="setCurrentComponent(viewQueue[0])"
            v-bind="{ problem }"
            @update-file-content="updateFileContent"
            @delete-file="deleteFile"
          >
          </component>
        </transition>
      </div>

      <div class="overflow-hidden">
        <transition name="second-card">
          <component
            :is="setCurrentComponent(viewQueue[1])"
            v-bind="{ problem }"
            @update-file-content="updateFileContent"
            @delete-file="deleteFile"
          >
          </component>
        </transition>
      </div>
    </SectionRight>
    <Divider />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { problems as problemSet } from '@/problem'
import { visualizationArea, areas } from '@/problem/viewTypes'

import {
  Divider,
  TheNavBar,
  SectionLeft,
  SectionRight,
  ProblemCLI,
  ProblemInstruction,
  GitDirectory,
  GitGraph,
  GitStagingArea,
  GitRemote,
} from '@/components'
import { PlainFile } from '@/git/fileStructure'

export default defineComponent({
  components: {
    Divider,
    TheNavBar,
    SectionLeft,
    SectionRight,
    ProblemCLI,
    ProblemInstruction,
    GitDirectory,
    GitGraph,
    GitStagingArea,
    GitRemote,
  },
  setup() {
    const problemIndex = ref(0)
    const problems = reactive(problemSet)

    const lastProblemIndex = problems.length
    const problem = computed(() => {
      return problems[problemIndex.value]
    })
    problem.value.setBase()

    const isCorrect = computed(() => {
      return problem.value.isCorrect()
    })

    const hasReset = ref(false)
    const resetProblem = () => {
      problem.value.resetToBase()
      problem.value.setBase()
      hasReset.value = true
    }
    const undoReset = () => {
      hasReset.value = false
    }
    const gotoPrevProblem = () => {
      problemIndex.value -= 1
    }
    const gotoNextProblem = () => {
      problemIndex.value += 1
    }
  
    const updateFileContent = (content: string, index: number) => {
      problems[problemIndex.value].refDirectory.children[index].content = content
    }

    const deleteFile = (file: PlainFile) => {
      problems[problemIndex.value].refDirectory.delete(file)
    }

    const viewQueueMap = reactive(
      problems.reduce(
        (acc, problem, idx) => ({ ...acc, [idx]: problem.defaultQueue }),
        {} as { [key: string]: (0 | 1 | 2 | 3)[] }
      )
    )
    const viewQueue = computed(() => {
      return viewQueueMap[String(problemIndex.value)]
    })
    const updateViewQueue = (nextViewIndex: 0 | 1 | 2 | 3) => {
      if (viewQueue.value.includes(nextViewIndex)) {
        const realIndex = viewQueue.value.indexOf(nextViewIndex)
        viewQueue.value.splice(realIndex, 1)
      } else {
        viewQueue.value.unshift(nextViewIndex)
        if (viewQueue.value.length > 2) {
          viewQueue.value.pop()
        }
      }
    }
    
    const setCurrentComponent = (viewIndex: number) => {

      for (const key in visualizationArea) {
        if (visualizationArea[key as areas] === viewIndex) {
          return key
        }
      }
    }

    return {
      problemIndex,
      lastProblemIndex,
      resetProblem,
      undoReset,
      gotoPrevProblem,
      gotoNextProblem,
      problem,
      isCorrect,
      hasReset,
      updateFileContent,
      deleteFile,
      viewQueue,
      updateViewQueue,
      setCurrentComponent,
    }
  },
})
</script>

<style>
#app {
  font-family: 'Noto Sans KR', Helvetica, Arial, sans-serif;
}

.navbar {
  @apply absolute w-full bg-gray-100;
}

.main {
  @apply grid grid-cols-2 bg-gray-200 h-screen pt-16;
}

/* first card */
.first-card-enter-from,
.first-card-enter-to {
  opacity: 0;
}

.first-card-enter-active {
  animation: insert 0.5s;
  animation-delay: 0.5s;
}

.first-card-leave-active {
  animation: moveDown 0.5s;
}

/* second card */
.second-card-enter-from,
.second-card-enter-to {
  opacity: 0;
}

.second-card-enter-active {
  animation: insert 0.5s;
  animation-delay: 0.1s;
}

.second-card-leave-active {
}

@keyframes insert {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes moveUp {
  0% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}

@keyframes moveDown {
  0% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>

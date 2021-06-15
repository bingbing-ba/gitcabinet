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
      <ProblemInstruction 
        :problem="problem"
      />
      <ProblemCLI 
        ref="ProblemCLI"
        :problem="problem"
        :hasReset="hasReset"
        @undo-reset="undoReset"
        @update-answer-manually="updateAnswerManually"
      />
    </SectionLeft>
    <SectionRight>
      <div v-for="viewIndex in viewQueue" :key="viewIndex" class="overflow-hidden">
        <component
          :is="setCurrentComponent(viewIndex)" 
          v-bind="setCurrentProps(viewIndex)"
          @update-file-content="updateFileContent"
          @delete-file="deleteFile">
        </component>
      </div>
    </SectionRight>
    <Divider/>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { problems as problemSet } from '@/problem'
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
import { PlainFile, Directory } from '@/git/fileStructure'
import { Git } from '@/git/git'
import { propertyOf } from 'lodash'

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
    GitRemote
  },
  setup() {
    const problemIndex = ref(0)
    const problems = reactive(problemSet)
    
    const lastProblemIndex = problems.length
    const problem = computed(()=>{
      return problems[problemIndex.value]
    })
    problem.value.setBase()

    let isCorrect = ref(false)
    let hasReset = ref(false)
    const resetProblem = () => {
      problem.value.resetToBase()
      problem.value.setBase()
      isCorrect.value = false
      hasReset.value = true
    }
    const undoReset = () => {
      hasReset.value = false
    }
    const gotoPrevProblem = () => {
      problemIndex.value -= 1
      isCorrect.value = false
    }
    const gotoNextProblem = () => {
      problemIndex.value += 1
      isCorrect.value = false
    }
    const updateAnswerManually = (answer: boolean) => {
      isCorrect.value = answer
    }

    const updateFileContent = (content: string, index: number) => {
      problems[problemIndex.value].refDirectory.children[index].content = content
    }

    const deleteFile = (file: PlainFile) => {
      problems[problemIndex.value].refDirectory.delete(file)
    }
    
    const viewQueue = ref([0, 1])
    
    const updateViewQueue = (nextViewIndex: number) => {
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
      switch (viewIndex) {
        case 1:
          return 'GitGraph'
        case 2:
          return 'GitStagingArea'
        case 3:
          return 'GitRemote'
        default:
          return 'GitDirectory'
      }
    }

    const setCurrentProps = (viewIndex: number) => {
      switch (viewIndex) {
        case 1:
          return {
            problem: problem.value
          }
        case 2:
          return {
            problem: problem.value
          }
        case 3:
          return {}
        default:
          return {
            git: problem.value.git,
            problem: problem.value
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
      updateAnswerManually,
      updateFileContent,
      deleteFile,
      viewQueue,
      updateViewQueue,
      setCurrentComponent,
      setCurrentProps
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
</style>

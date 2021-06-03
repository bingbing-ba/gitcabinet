<template>
  <TheNavBar 
    class="navbar" 
    :problem="problem"
    :problemIndex="problemIndex"
    :lastProblemIndex="lastProblemIndex"
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
    
    const resetProblem = () => {
      problem.value.resetToBase()
      problem.value.setBase()
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
          return {}
        case 3:
          return {}
        default:
          return {
            git: problem.value.git
          }
      }
    }
    
    return {
      problemIndex,
      lastProblemIndex,
      resetProblem,
      gotoPrevProblem,
      gotoNextProblem,

      problem,
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

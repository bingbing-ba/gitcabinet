<template>
  <TheNavBar 
    class="navbar" 
    :problem="problem"
    :problemIndex="problemIndex"
    :lastProblemIndex="lastProblemIndex"
    @goto-prev-problem="gotoPrevProblem"
    @goto-next-problem="gotoNextProblem"
    @reset-problem="resetProblem"
  />
  <main class="main">
    <SectionLeft>
      <ProblemInstruction 
        :problem="problem"
      />
      <ProblemCLI 
        :problem="problem"
      />
    </SectionLeft>
    <SectionRight>
      <GitDirectory/>
      <GitGraph/>
    </SectionRight>
    <Divider/>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { cli } from '@/cli'
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
} from '@/components'

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
  },
  setup() {
    const problemIndex = ref(0)
    const problems = reactive(problemSet)
    
    const lastProblemIndex = problems.length
    const problem = computed(()=>{
      return problems[problemIndex.value]
    })

    const resetProblem = () => {
      console.log(problem)
    }

    const gotoPrevProblem = () => {
      problemIndex.value -= 1
    }
    const gotoNextProblem = () => {
      problemIndex.value += 1
    }
    
    return {
      problem,
      problemIndex,
      lastProblemIndex,
      resetProblem,
      gotoPrevProblem,
      gotoNextProblem,
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

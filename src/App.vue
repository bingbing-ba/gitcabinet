<template>
  <TheNavBar class="navbar"/>
  <main class="main">
    <SectionLeft>
      <ProblemInstruction :problem="problem">
      </ProblemInstruction>
      <ProblemCLI/>
    </SectionLeft>
    <SectionRight>
      <GitDirectory>
      </GitDirectory>
      <GitGraph>
      </GitGraph>
    </SectionRight>
    <Divider/>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { cli } from '@/cli'
import { problems as problemSet } from '@/problems'
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

    const problem = computed(()=>{
      return problems[problemIndex.value]
    })

    const resultString = ref('')
    const onCommand = (inputCommand: string) => {
      resultString.value = cli(inputCommand, problem.value)
      console.log('onCommand', resultString.value)
    }
    const nextProblem = () => {
      problemIndex.value += 1
      console.log('nextproblem', problemIndex)
    }
    return {
      problem,
      onCommand,
      resultString,
      nextProblem,
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

<template>
  <div>
    <problem-view :problem="problem" @next-problem="nextProblem"/>
    <CLIView
      :problem="problem"
      :resultString="resultString"
      @command="onCommand"
    />
    <file-tree :problem="problem" />
    <commit-graph :problem="problem" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { ProblemView, CLIView, FileTree, CommitGraph } from '@/components'
import { cli } from '@/cli'
import { problems as problemSet } from '@/problems'
export default defineComponent({
  components: {
    ProblemView,
    CLIView,
    FileTree,
    CommitGraph,
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

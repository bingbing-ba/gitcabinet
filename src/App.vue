<template>
  <div>
    <problem-view :problem="problem"/>
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
import { defineComponent, reactive, ref } from 'vue'
import { ProblemView, CLIView, FileTree, CommitGraph } from '@/components'
import { cli } from '@/cli'
import { problems } from '@/problems'
export default defineComponent({
  components: {
    ProblemView,
    CLIView,
    FileTree,
    CommitGraph,
  },
  setup() {
    const problemIndex = ref(0)
    const problem = reactive(problems[problemIndex.value])
    const resultString = ref('')
    const onCommand = (inputCommand: string) => {
      resultString.value = cli(inputCommand, problem)
      console.log('onCommand', resultString.value)
    }
    return {
      problem,
      onCommand,
      resultString,
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

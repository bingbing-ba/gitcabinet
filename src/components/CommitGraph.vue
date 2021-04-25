<template>
  <div>
    <h2>commit graph</h2>
    <ul>
      <li v-for="commit in commits" :key="commit.hash">
        <p>{{commit.hash}}</p>
        <p>message: {{commit.message}}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Problem } from "@/problems";
import { computed, defineComponent } from "@vue/runtime-core";


export default defineComponent({
  props:{
    problem:{
      type:Problem,
      required: true,
    },
  },
  setup(props){

    const commits = computed(()=>{
      if (props.problem.git === undefined) {
        return []
      }
      const head = props.problem.git.head
      const headCommitHash = props.problem.git.branches[head]
      if (headCommitHash === '') {
        return []
      }
      const headCommit = props.problem.git.commits[headCommitHash]
      const result = []
      const stack = [{...headCommit, hash:headCommitHash}]
      while (stack.length !== 0) {
        const commit = stack.pop()
        result.push(commit)
        for (const parentHash of commit!.parent) {
          const parentCommit = props.problem.git.commits[parentHash]
          stack.push({...parentCommit, hash:parentHash})
        }
      }
      return result
    })

    return {
      commits,
    }
  },
})
</script>

<style>

</style>
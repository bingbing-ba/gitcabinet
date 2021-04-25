<template>
  <div>
    <h2>fileTree</h2>
    <ul>
      <li v-for="filename in filenames" :key="filename">{{filename}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Problem } from "@/problems";

export default defineComponent({
  props:{
    problem:{
      type: Problem,
      required: true,
    },
  },
  setup(props){
    const filenames = computed(()=>{
      return props.problem.refDirectory.getChildrenName()
    })
    return {
      filenames,
    }
  }
})
</script>

<style>

</style>
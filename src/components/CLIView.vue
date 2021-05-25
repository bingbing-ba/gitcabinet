<template>
  <div>
    <h3>resultString</h3>
    <pre style="text-align:left">{{ resultString }}</pre>
    <label for="command">명령어: </label>
    <input
      type="text"
      id="command"
      v-model="inputCommand"
      @change.prevent="onChange"
    />
  </div>
</template>

<script lang="ts">
import { Problem } from '@/problem/problem'
import { defineComponent, ref } from '@vue/runtime-core'
export default defineComponent({
  props: {
    problem: {
      type: Problem,
      required: true,
    },
    resultString: {
      type: String,
    }
  },
  setup(props, context) {
    const inputCommand = ref('')
    
    const onChange = () => {
      context.emit('command', inputCommand.value)
      inputCommand.value = ''
    }
    return {
      inputCommand,
      onChange,
    }
  },
})
</script>

<style></style>

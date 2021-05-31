<template> 
  <textarea 
    v-model="content"
    @input="updateContent"
    @click.stop
    class="resize-none bg-gray-300 w-full flex min-h-100px p-2">
  </textarea>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
  },
  props: {
    fileContent: {
      type: String
    }
  },
  setup(props, context) {
    const content = ref('')
    content.value = props.fileContent || ''

    const updateContent = () => {
      context.emit('update-file-content', content.value)
    }
    return {
      content,
      updateContent
    }
  }
})
</script>

<style scoped>
.min-h-100px {
  min-height: 100px;
}
</style>

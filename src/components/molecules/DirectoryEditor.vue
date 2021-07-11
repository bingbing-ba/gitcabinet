<template> 
  <textarea 
    v-model="content"
    @input="updateContent"
    @click.stop
    class="resize-none bg-gray-200 w-80 flex min-h p-2 rounded">
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
    },
    isEditMode: {
      type: Boolean,
    },
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
.min-h {
  min-height: 48px;
}
</style>

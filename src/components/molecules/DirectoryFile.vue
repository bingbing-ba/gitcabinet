<template>
  <div>
    <button @click="toggleEditMode" class="flex">
      <IconTextFile/> {{ file.filename }} : {{ file.content}}
    </button>

    <transition name="slide">
      <div v-show="isEditMode" class="p-2">
        <DirectoryEditor 
          :fileContent="fileContent"
          @update-file-content="updateFileContent" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { IconTextFile, DirectoryEditor } from '@/components'
import { PlainFile } from '@/git/fileStructure'

export default defineComponent({
  components: {
    IconTextFile,
    DirectoryEditor
  },
  props: {
    file: {
      type: PlainFile
    },
    index: {
      type: Number
    }
  },
  setup(props, context) {
    const isEditMode = ref(false)

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value
    }

    const fileContent = computed(() => {
      return props.file?.content || ''
    })

    const updateFileContent = (content: string) => {
      context.emit('update-file-content', content, props.index)
    }
    return {
      isEditMode,
      toggleEditMode,
      fileContent,
      updateFileContent
    }
  },
})
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.1s linear;
}

.slide-leave-active {
  transition: all 0.1s linear;
}

.slide-enter-from,
.slide-leave-to {
  height: 0;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  height: 100px;
  overflow: hidden;
}
</style>

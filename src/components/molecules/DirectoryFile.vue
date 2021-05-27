<template>
  <div>
    <button @click="toggleEditMode" 
      class="flex" 
      :class="{ 
        'text-yellow-500': isModified,
        'text-green-500': isUnstaged 
      }">
      <IconTextFile/> {{ file.filename }}
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
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    IconTextFile,
    DirectoryEditor
  },
  props: {
    git: {
      type: Git
    },
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

    const isModified = computed(() => {
      const nowStatus = props.git?.status()
      return nowStatus?.statusNotToCommit.modified.includes(props.file?.filename || '')
    })

    const isUnstaged = computed(() => {
      const nowStatus = props.git?.status()
      return nowStatus?.statusNotToCommit.unstaged.includes(props.file?.filename || '')
    })

    return {
      isEditMode,
      toggleEditMode,
      fileContent,
      updateFileContent,
      isModified,
      isUnstaged
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

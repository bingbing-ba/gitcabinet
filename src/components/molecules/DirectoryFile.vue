<template>
  <div>
    <button @click="toggleEditMode" 
      class="flex items-center relative"
      :class="{ 
        'text-yellow-500': isNotToCommitModified || isToCommitModified,
        'text-green-500': isNotToCommitUnstaged || isToCommitCreated
      }">
      <IconTextFile/> {{ file.filename }}
      <div class="absolute -right-40 w-36" >
        <Badge
          v-if="isChanged"
          :color="
            isNotToCommitUnstaged || isToCommitCreated
            ? 'green'
            : isNotToCommitModified || isToCommitModified
            ? 'yellow': ''" >
          {{ isToCommitCreated
            ? 'ready to commit (created)'
            : isToCommitModified
            ? 'ready to commit (modified)'
            : isNotToCommitUnstaged
            ? 'not ready to commit (unstaged)'
            : isNotToCommitModified
            ? 'not ready to commit (modifed)'
            : '' }}
        </Badge>
      </div>
    </button>

    <transition name="slide">
      <div v-show="isEditMode" class="p-2">
        <DirectoryEditor 
          :fileContent="fileContent"
          @update-file-content="updateFileContent" />
        <button @click="deleteFile"><IconTrash /></button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { IconTextFile, DirectoryEditor, Badge, IconTrash } from '@/components'
import { PlainFile } from '@/git/fileStructure'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    IconTextFile,
    IconTrash,
    DirectoryEditor,
    Badge
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

    const closeEditor = (event: Event) => {
      event.stopPropagation()
      isEditMode.value = false
    }

    watch(isEditMode, (isEditMode) => {
      if (isEditMode) {
        // console.log('add')
        document.addEventListener('click', closeEditor)
      } else {
        // console.log('remove')
        document.removeEventListener('click', closeEditor)
      }
    })

    const toggleEditMode = (event: Event) => {
      event.stopPropagation()
      isEditMode.value = !isEditMode.value
    }

    const fileContent = computed(() => {
      return props.file?.content || ''
    })

    const updateFileContent = (content: string) => {
      context.emit('update-file-content', content, props.index)
    }

    const deleteFile = () => {
      context.emit('delete-file', props.file)
    }

    const isToCommitModified = computed(() => {
      const nowStatus = props.git?.status()
      return nowStatus?.statusToCommit.modified.includes(props.file?.filename || '')
    })

    const isToCommitCreated = computed(() => {
      const nowStatus = props.git?.status()
      return nowStatus?.statusToCommit.created.includes(props.file?.filename || '')
    })

    const isReadyToCommit = computed(() => {
      const modified = isToCommitModified.value
      const created = isToCommitCreated.value
      // 삭제는 별도로 표시
      return modified || created
    })

    const isNotToCommitModified = computed(() => {
      const nowStatus = props.git?.status()
      return nowStatus?.statusNotToCommit.modified.includes(props.file?.filename || '')
    })

    const isNotToCommitUnstaged = computed(() => {
      const nowStatus = props.git?.status()
      return nowStatus?.statusNotToCommit.unstaged.includes(props.file?.filename || '')
    })

    const isNotReadyToCommit = computed(() => {
      const modified = isNotToCommitModified.value
      const unstaged = isNotToCommitUnstaged.value
      // 삭제는 별도로 표시
      return modified || unstaged
    })

    const isChanged = computed(() => {
      return isReadyToCommit.value || isNotReadyToCommit.value
    })

    return {
      isEditMode,
      toggleEditMode,
      fileContent,
      updateFileContent,
      deleteFile,
      isChanged,
      isReadyToCommit,
      isNotReadyToCommit,
      isToCommitModified,
      isNotToCommitModified,
      isToCommitCreated,
      isNotToCommitUnstaged
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

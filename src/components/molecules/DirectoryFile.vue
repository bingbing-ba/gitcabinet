<template>
  <div>
    <button @click="toggleEditMode" 
      class="flex items-center relative"
      :class="{ 
        'text-yellow-500': isNotToCommitModified,
        'text-green-500': isNotToCommitUntracked
      }">
      <IconTextFile/> {{ fileName }}
      <div class="absolute -right-40 w-36" >
        <Badge
          v-if="isNotToCommitUntracked || isNotToCommitModified"
          :color="
            isNotToCommitUntracked
            ? 'green'
            : isNotToCommitModified
            ? 'yellow'
            : ''" >
          {{ isNotToCommitUntracked
            ? '생성'
            : isNotToCommitModified
            ? '수정'
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
  setup(props, { emit } ) {
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

    const fileName = computed(() => {
      return props.file?.filename || ''
    })
    const fileContent = computed(() => {
      return props.file?.content || ''
    })

    const updateFileContent = (content: string) => {
      emit('update-file-content', content, props.index)
    }

    const deleteFile = () => {
      emit('delete-file', props.file)
    }

    const nowStatus = computed(() => {
      return props.git?.status()
    })

    const statusNotToCommit = computed(() => {
      return nowStatus.value?.statusNotToCommit
    })

    const notToCommitUntrackedFileList = computed(() => {
      return statusNotToCommit.value?.unstaged
    })

    const notToCommitModifiedFileList = computed(() => {
      return statusNotToCommit.value?.modified
    })

    const notToCommitDeletedFileList = computed(() => {
      return statusNotToCommit.value?.deleted
    })

    const isNotToCommitUntracked = computed(() => {
      return notToCommitUntrackedFileList.value?.includes(fileName.value)
    })

    const isNotToCommitModified = computed(() => {
      return notToCommitModifiedFileList.value?.includes(fileName.value)
    })

    return {
      isEditMode,
      toggleEditMode,
      fileName,
      fileContent,
      updateFileContent,
      deleteFile,
      notToCommitUntrackedFileList,
      notToCommitModifiedFileList,
      notToCommitDeletedFileList,
      isNotToCommitUntracked,
      isNotToCommitModified,

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

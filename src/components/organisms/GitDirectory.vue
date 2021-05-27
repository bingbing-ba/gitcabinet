<template>
  <div class="git-directory overflow-y-hidden">
    <div class="bg-gray-200">
      <Title class="git-directory__text">
        디렉토리
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-scroll overflow-x-hidden max-h-full">
      <div class="flex max-w-full">
        <div class="w-3/4">
          <DirectoryFolder v-if="dirName" :dirName="dirName" class="pb-2"/>
          <DirectoryFile
            class="pl-5 py-2"
            v-for="(file, index) in fileList"
            :key="file.filename"
            :git="git"
            :file="file"
            :index="index"
            @update-file-content="updateFileContent"
            @delete-file="deleteFile" />
        </div>
        <div class="w-1/4">
          <IconTrash />
          <div v-for="(fileName, idx) in deletedFiles" :key="idx">
            {{ fileName }}
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Title, Card, DirectoryFile, DirectoryFolder, IconTrash } from '@/components'
import { PlainFile } from '@/git/fileStructure'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    Title,
    Card,
    DirectoryFile,
    DirectoryFolder,
    IconTrash
  },
  props: {
    git: {
      type: Git
    }
  },
  setup(props, context) {
    const fileList = computed(() => {
      return props.git?.refDirectory?.children || []
    })

    const dirName = computed(() => {
      return props.git?.refDirectory?.dirName || ''
    })

    const updateFileContent = (content: string, index: number) => {
      context.emit('update-file-content', content, index)
    }

    const deleteFile = (file: PlainFile) => {
      context.emit('delete-file', file)
    }

    const deletedFiles = computed(() => {
      const nowStatus = props.git?.status()
      const result: string[] = []
      nowStatus?.statusNotToCommit.deleted.forEach(fileName => {
        result.push(fileName)
      })
      nowStatus?.statusToCommit.deleted.forEach(fileName => {
        result.push(fileName)
      })
      return result
    })

    return {
      dirName,
      fileList,
      updateFileContent,
      deleteFile,
      deletedFiles
    }
  },
})
</script>

<style>
.git-directory {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow;
}

.git-directory__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

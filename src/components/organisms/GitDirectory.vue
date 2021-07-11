<template>
  <div class="git-directory">
    <div class="bg-gray-200">
      <Title class="git-directory__text">
        디렉토리
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-auto overflow-x-hidden container-height custom-scroll-bar">
      <div v-if="dirName" class="xl:flex max-w-full">
        <div class="w-full">
          <DirectoryFolder :dirName="dirName" class="pb-2"/>
          <DirectoryFile
            class="pl-5 py-2"
            v-for="(file, index) in fileList"
            :key="file.id"
            :git="git"
            :file="file"
            :index="index"
            @update-file-content="updateFileContent"
            @delete-file="deleteFile" />
        </div>
        <hr class="xl:hidden m-5">
        <div class="w-full" v-if="deletedFiles.length">
          <p v-if="fileList.length" class="flex pb-2"><IconTrash />삭제된 파일</p>
          <div v-for="(fileName) in deletedFiles" :key="fileName.id" class="pl-5 py-2">
            <p class="flex overflow-hidden"><IconTextFile/> {{ fileName }}</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Title, Card, DirectoryFile, DirectoryFolder, IconTrash, IconTextFile } from '@/components'
import { PlainFile } from '@/git/fileStructure'
import { Problem } from '@/problem'

export default defineComponent({
  components: {
    Title,
    Card,
    DirectoryFile,
    DirectoryFolder,
    IconTrash,
    IconTextFile
  },
  props: {
    problem: {
      type: Problem
    }
  },
  setup(props, context) {
    const git = computed(() => {
      return props.problem?.git
    })
    const fileList = computed(() => {
      if (git.value) {
        return git.value.refDirectory?.children
      }
      return props.problem?.refDirectory?.children
    })

    const dirName = computed(() => {
      return props.problem?.refDirectory?.dirName || ''
    })

    const updateFileContent = (content: string, index: number) => {
      context.emit('update-file-content', content, index)
    }

    const deleteFile = (file: PlainFile) => {
      context.emit('delete-file', file)
    }

    const deletedFiles = computed(() => {
      const nowStatus = git.value?.status()
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
      git,
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
  @apply bg-white rounded-bl-lg rounded-br-lg shadow h-full overflow-hidden;
}

.git-directory__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

<template>
  <div class="git-directory overflow-y-hidden">
    <div class="bg-gray-200">
      <Title class="git-directory__text">
        디렉토리
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-scroll overflow-x-hidden max-h-full">
      <DirectoryFolder v-if="dirName" :dirName="dirName" class="pb-2"/>
      <DirectoryFile
        class="pl-5 py-2"
        v-for="(file, index) in fileList"
        :key="file.filename"
        :git="git"
        :file="file"
        :index="index"
        @update-file-content="updateFileContent"/>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Title, Card, DirectoryFile, DirectoryFolder } from '@/components'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    Title,
    Card,
    DirectoryFile,
    DirectoryFolder
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

    return {
      dirName,
      fileList,
      updateFileContent
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

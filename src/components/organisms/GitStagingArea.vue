<template>
  <div class="git-staging-area">
    <div class="bg-gray-200">
      <Title class="git-staging-area__text">
        Staging Area
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-auto overflow-x-hidden max-h-full">
      <div v-if="nowStatus" class="w-full flex flex-col">
        <span 
          class="pl-5 py-2 flex relative"
          v-for="hash, fileName in stagingAreaIndex" 
          :key="hash"
          :class="{ 
            'text-yellow-500': isToCommitModified(fileName),
            'text-green-500': isToCommitUntracked(fileName)
          }">
          <IconTextFile /> {{ fileName }}
          <div class="absolute right-20 w-36" >
            <Badge
              v-if="isToCommitUntracked(fileName) || isToCommitModified(fileName)"
              :color="
                isToCommitUntracked(fileName)
                ? 'green'
                : isToCommitModified(fileName)
                ? 'yellow'
                : ''" >
              {{ isToCommitUntracked(fileName)
                ? '생성'
                : isToCommitModified(fileName)
                ? '수정'
                : '' }}
            </Badge>
          </div>
        </span>
      </div>
      <div v-else>
        현재 이 디렉토리는 git 저장소가 아닙니다.
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Title, Card, IconTextFile, Badge } from '@/components'
import { Problem } from '@/problem'

export default defineComponent({
  components: {
    Title,
    Card,
    IconTextFile,
    Badge
  },
  props: {
    problem: {
      type: Problem
    }
  },
  setup(props) {
    const stagingAreaIndex = computed(() => {
      return props.problem?.git?.index
    })

    const nowStatus = computed(() => {
      return props.problem?.git?.status()
    })

    // staging area status
    const statusToCommit = computed(() => {
      return nowStatus.value?.statusToCommit
    })

    // staging area file list
    const toCommitUntrackedFileList = computed(() => {
      return statusToCommit.value?.created
    })

    const toCommitModifiedFileList = computed(() => {
      return statusToCommit.value?.modified
    })

    const toCommitDeletedFileList = computed(() => {
      return statusToCommit.value?.deleted
    })

    const isToCommitUntracked = (fileName: string) => {
      return toCommitUntrackedFileList.value?.includes(fileName)
    }

    const isToCommitModified = (fileName: string) => {
      return toCommitModifiedFileList.value?.includes(fileName)
    }

    return {
      nowStatus,
      statusToCommit,
      stagingAreaIndex,
      toCommitUntrackedFileList,
      toCommitModifiedFileList,
      toCommitDeletedFileList,
      isToCommitUntracked,
      isToCommitModified
    }
  }
})
</script>

<style scoped>
.git-staging-area {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow h-full overflow-hidden;
}

.git-staging-area__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

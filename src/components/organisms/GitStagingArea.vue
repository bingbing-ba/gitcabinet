<template>
  <div class="git-staging-area">
    <div class="bg-gray-200">
      <Title class="git-staging-area__text">
        Staging Area
      </Title>
    </div>
    <Card class="bg-white p-10 overflow-y-auto overflow-x-hidden max-h-full">
      <div v-if="nowStatus" class="w-full flex justify-center">
        <div class="w-1/2 rounded-lg border-4 p-5">
          <p class="text-center">working directory</p>
          <div>
            <p class="py-5">새로 생성된 파일</p>
            <div v-for="fileName, idx in notToCommitUntrackedFileList" :key="idx" class="flex pl-5">
              <IconTextFile /> {{ fileName }}
            </div>
            <p class="py-5">수정된 파일</p>
            <div v-for="fileName, idx in notToCommitModifiedFileList" :key="idx" class="flex pl-5">
              <IconTextFile /> {{ fileName }}
            </div>
            <p class="py-5">삭제된 파일</p>
            <div v-for="fileName, idx in notToCommitDeleteddFileList" :key="idx" class="flex pl-5">
              <IconTextFile /> {{ fileName }}
            </div>
          </div>
        </div>
        <div class="w-1/2 rounded-lg border-4 p-5 ml-3">
          <p class="text-center">staging area</p>
          <div>
            <p class="py-5">새로 생성된 파일</p>
            <div v-for="fileName, idx in toCommitUntrackedFileList" :key="idx" class="flex pl-5">
              <IconTextFile /> {{ fileName }}
            </div>
            <p class="py-5">수정된 파일</p>
            <div v-for="fileName, idx in toCommitModifiedFileList" :key="idx" class="flex pl-5">
              <IconTextFile /> {{ fileName }}
            </div>
            <p class="py-5">삭제된 파일</p>
            <div v-for="fileName, idx in toCommitDeleteddFileList" :key="idx" class="flex pl-5">
              <IconTextFile /> {{ fileName }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        현재 이 디렉토리는 git 저장소가 아닙니다.
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Title, Card, IconTextFile } from '@/components'
import { Problem } from '@/problem'

export default defineComponent({
  components: {
    Title,
    Card,
    IconTextFile
  },
  props: {
    problem: {
      type: Problem
    }
  },
  setup(props) {
    const nowStatus = computed(() => {
      return props.problem?.git?.status()
    })

    // working directory status
    const statusNotToCommit = computed(() => {
      return nowStatus.value?.statusNotToCommit
    })

    // staging area status
    const statusToCommit = computed(() => {
      return nowStatus.value?.statusToCommit
    })

    // working directory file list
    const notToCommitUntrackedFileList = computed(() => {
      return statusNotToCommit.value?.unstaged
    })

    const notToCommitModifiedFileList = computed(() => {
      return statusNotToCommit.value?.modified
    })

    const notToCommitDeletedFileList = computed(() => {
      return statusNotToCommit.value?.deleted
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

    return {
      nowStatus,
      statusNotToCommit,
      statusToCommit,
      notToCommitUntrackedFileList,
      notToCommitModifiedFileList,
      notToCommitDeletedFileList,
      toCommitUntrackedFileList,
      toCommitModifiedFileList,
      toCommitDeletedFileList,
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

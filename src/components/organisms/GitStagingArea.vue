<template>
  <div class="git-staging-area relative">
    <div class="bg-gray-200">
      <Title class="git-staging-area__text">
        Staging Area
      </Title>
    </div>
    <Card class="git-staging-area__card">
      <div v-if="nowStatus" class="w-full flex flex-col">
        <div v-if="isEmptyIndex">
          Staging Area가 비어있습니다.
        </div>
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
            <Badge v-if="isToCommitUntracked(fileName)" :color="'green'">생성</Badge>
            <Badge v-else-if="isToCommitModified(fileName)" :color="'yellow'">수정</Badge>
          </div>
        </span>
      </div>
      <div v-else>
        현재 이 디렉토리는 git 저장소가 아닙니다.
      </div>
    </Card>

    <transition name="slide-fade" >
      <MessageBox 
        v-if="isReadyToViewMessage"
        @toggle-view-status="toggleViewStatus"
        :color="'green'">
        Staging Area에 추가 되었습니다.
      </MessageBox>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { Title, Card, IconTextFile, Badge, MessageBox } from '@/components'
import { Problem } from '@/problem'

export default defineComponent({
  components: {
    Title,
    Card,
    IconTextFile,
    Badge,
    MessageBox
  },
  props: {
    problem: {
      type: Problem,
      required: true
    },
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

    const isEmptyIndex = computed(() => {
      return stagingAreaIndex.value && Object.keys(stagingAreaIndex.value).length === 0 
    })

    const isReadyToViewMessage = ref(false)
    watch(props.problem, () => {
      const _isReadyToGit = props.problem?.git? true: false
      const _isReadyToCommit = toCommitUntrackedFileList.value?.length !== 0 
        || toCommitModifiedFileList.value?.length !== 0
        || toCommitDeletedFileList.value?.length !== 0
      isReadyToViewMessage.value = _isReadyToGit && _isReadyToCommit
    })
    const toggleViewStatus = () => {
      isReadyToViewMessage.value = !isReadyToViewMessage.value
    }

    return {
      nowStatus,
      statusToCommit,
      stagingAreaIndex,
      toCommitUntrackedFileList,
      toCommitModifiedFileList,
      toCommitDeletedFileList,
      isToCommitUntracked,
      isToCommitModified,
      isReadyToViewMessage,
      isEmptyIndex,
      toggleViewStatus
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

.git-staging-area__card {
  height: calc(100% - 2.75rem);
  display: grid;
  @apply bg-white overflow-auto;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1)
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
</style>

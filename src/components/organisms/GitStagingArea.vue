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
        <!-- v-else 를 넣으면 watch stagingAreaIndex 가 처음에 동작하지 않음 -->
        <StagingAreaStatus
          :stagingAreaIndex="stagingAreaIndex" 
          :nowStatus="nowStatus" 
          @activate-view-status="activateViewStatus" />
      </div>
      <div v-else>
        현재 이 디렉토리는 git 저장소가 아닙니다.
      </div>
    </Card>

    <transition name="slide-fade" >
      <MessageBox 
        v-if="isReadyToViewMessage && !isEmptyToCommit"
        @toggle-view-status="toggleViewStatus"
        :color="'green'">
        Staging Area 가 변경되었습니다.
      </MessageBox>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { Title, Card, MessageBox, StagingAreaStatus } from '@/components'
import { Problem } from '@/problem'

export default defineComponent({
  components: {
    Title,
    Card,
    MessageBox,
    StagingAreaStatus
  },
  props: {
    problem: {
      type: Problem,
      required: true
    },
  },
  setup(props) {
    const stagingAreaIndex = computed(() => {
      return props.problem.git?.index
    })

    const nowStatus = computed(() => {
      return props.problem.git?.getStatusToCommit()
    })

    const isEmptyToCommit = computed(() => {
      return nowStatus.value?.created.length === 0 
      && nowStatus.value?.modified.length === 0 
      && nowStatus.value?.deleted.length === 0
    })
    
    const isReadyToViewMessage = ref(false)

    const activateViewStatus = (target: boolean) => {
      isReadyToViewMessage.value = target
    }

    const toggleViewStatus = () => {
      isReadyToViewMessage.value = !isReadyToViewMessage.value
    }

    const isEmptyIndex = computed(() => {
      return stagingAreaIndex.value && Object.keys(stagingAreaIndex.value).length === 0 
    })

    return {
      nowStatus,
      stagingAreaIndex,
      isReadyToViewMessage,
      activateViewStatus,
      toggleViewStatus,
      isEmptyIndex,
      isEmptyToCommit
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

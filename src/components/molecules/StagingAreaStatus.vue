<template>
  <div class="staging-area-item pb-2" v-for="(hash, fileName) in stagingAreaIndex" :key="hash">
    <div
      class="flex pb-2"
      :class="{
        'text-yellow-500': isToCommitModified(fileName),
        'text-green-500': isToCommitUntracked(fileName),
      }"
    >
      <IconTextFile /> {{ fileName }}
      <div class="pl-10">
        <Badge v-if="isToCommitUntracked(fileName)" :color="'green'">생성</Badge>
        <Badge v-else-if="isToCommitModified(fileName)" :color="'yellow'">수정</Badge>
      </div>
    </div>
    <textarea
      :value="getFileContentFromHash(hash)"
      readonly
      @click.stop
      class="resize-none bg-gray-200 w-80 flex min-h p-2 rounded"
    >
    </textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { IconTextFile, Badge } from '@/components'
import { Problem } from '@/problem'

export default defineComponent({
  components: {
    IconTextFile,
    Badge,
  },
  props: {
    nowStatus: {
      type: Object,
      required: true,
    },
    stagingAreaIndex: {
      type: Object,
      required: true,
    },
    problem: {
      type: Problem,
      required: true,
    },
  },
  emits: ['activate-view-status'],
  setup(props, { emit }) {
    const toCommitUntrackedFileList = computed(() => {
      return props.nowStatus.created
    })

    const toCommitModifiedFileList = computed(() => {
      return props.nowStatus.modified
    })

    const toCommitDeletedFileList = computed(() => {
      return props.nowStatus.deleted
    })

    const isToCommitUntracked = (fileName: string) => {
      return toCommitUntrackedFileList.value?.includes(fileName)
    }

    const isToCommitModified = (fileName: string) => {
      return toCommitModifiedFileList.value?.includes(fileName)
    }

    const changeViewStatus = (target: boolean) => {
      emit('activate-view-status', target)
    }

    // add를 하게 되면 staging area에 변화가 생김 : index의 변화는 반드시 알려준다.
    // commit 했을때는 변하지 않음.
    watch(props.stagingAreaIndex, () => {
      changeViewStatus(true)
    })

    const getFileContentFromHash = (hash: string) => {
      const fileHashes = props.problem.git?.fileHashes
      if (fileHashes) {
        return fileHashes[hash]
      }
      return ''
    }

    return {
      toCommitUntrackedFileList,
      toCommitModifiedFileList,
      toCommitDeletedFileList,
      isToCommitUntracked,
      isToCommitModified,
      getFileContentFromHash,
    }
  },
})
</script>

<style scoped>
.staging-area-item {
  display: flex;
  flex-direction: column;
}
.staging-area-item textarea:focus {
  outline: none;
}
</style>

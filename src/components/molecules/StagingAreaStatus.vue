<template>
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
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { IconTextFile, Badge } from '@/components'

export default defineComponent({
  components: {
    IconTextFile,
    Badge,
  },
  props: {
    nowStatus: {
      type: Object,
      required:true
    },
    stagingAreaIndex: {
      type: Object,
      required: true
    }
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

    return {
      toCommitUntrackedFileList,
      toCommitModifiedFileList,
      toCommitDeletedFileList,
      isToCommitUntracked,
      isToCommitModified,
    }
  }
})
</script>

<style scoped>
</style>

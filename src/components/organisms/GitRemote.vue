<template>
  <div class="git-graph">
    <div class="bg-gray-200">
      <Title class="git-graph__text">
        원격 저장소
      </Title>
    </div>
    <Card class="git-graph__card">
      <div v-if="isRemote" class="git-graph__main">
        <transition v-if="commits.length > 0" name="swap">
          <NetworkVertical :git="remote" :commits="commits" />
        </transition>
        <div v-else class="grid justify-center items-center">
          원격 저장소에 커밋이 없습니다.
        </div>
      </div>
      <div v-else class="flex justify-center items-center">
        원격 저장소가 존재하지 않습니다.
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Title, Card, NetworkVertical, Button } from '@/components'
import { Problem } from '@/problem'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    Title,
    Card,
    NetworkVertical,
    Button,
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const branches = computed(() => {
      return props.problem.git?.branches
    })

    const nowHead = ref('master')

    const changeHead = (branchName: string) => {
      nowHead.value = branchName
    }

    const isRemote = computed(() => {
      return props.problem.git?.config.remote['origin'] instanceof Git
    })

    const commits = computed(() => {
      const origin = props.problem.git?.config.remote['origin']

      if (!origin) {
        return []
      }
      // 브랜치 별 결과 출력 준비
      const result = []

      // head : 브랜치 이름
      // const head = props.problem.git.head
      const head = nowHead.value

      // headCommitHash : 해당 브랜치의 가장 최근 커밋 해쉬
      const headCommitHash = origin.branches[head]

      // 커밋 기록이 없는 경우
      if (headCommitHash === '') {
        return []
      }

      // 기준이 될 commit 노드 설정
      const headCommit = origin.commits[headCommitHash]

      // 검사를 진행할 스택
      const stack = [
        // 해당 커밋 노드의 hash를 포함한 새로운 객체
        {
          ...headCommit,
          hash: headCommitHash,
        },
      ]

      // 스택에서
      while (stack.length !== 0) {
        const commit = stack.pop()
        result.push(commit)
        for (const parentHash of commit!.parent) {
          const parentCommit = origin.commits[parentHash]
          stack.push({ ...parentCommit, hash: parentHash })
        }
      }
      return result
    })

    const remote = computed(() => {
      return props.problem.git?.config.remote['origin']
    })
    return {
      commits,
      branches,
      isRemote,
      remote,
      changeHead,
    }
  },
})
</script>

<style scoped>
.git-graph {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow h-full overflow-hidden;
}

.git-graph__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}

.git-graph__card {
  height: calc(100% - 2.75rem);
  display: grid;
  @apply bg-white overflow-auto;
}

.git-graph__main {
  display: grid;
  grid-template-rows: 1fr 3fr;
}

.git-graph__card::-webkit-scrollbar {
  @apply bg-white w-3 rounded;
}

.git-graph__card::-webkit-scrollbar-corner {
  @apply bg-gray-900 rounded;
}

.git-graph__card::-webkit-scrollbar-corner {
  @apply bg-gray-900 rounded;
}

.git-graph__card::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded w-2 mt-3;
}
</style>

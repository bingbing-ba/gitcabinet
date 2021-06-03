<template>
  <div class="git-graph">
    <div class="bg-gray-200">
      <Title class="git-graph__text">
        커밋 그래프
      </Title>
    </div>
    <Card class="bg-white pb-10 overflow-y-scroll overflow-x-scroll max-h-full">
      <div v-if="problem.git" class="p-2">
        <div class="flex items-center overflow-auto">
          <Button v-if="isVerticalView" @click="toggleNetworkView" class="flex align-middle items-center mx-2">
            <IconSwitchHorizontal /> 수평 모드
          </Button>
          <Button v-else @click="toggleNetworkView" class="flex align-middle items-center mx-2">
            <IconSwitchVertical /> 수직 모드
          </Button>
          <button v-for="(hash, branch) in branches" :key="hash" @click="changeHead(branch)" 
            class="mx-2 flex">
            <Badge>
              {{ branch }}
            </Badge>
          </button>
        </div>
        
        <transition name="swap">
          <NetworkVertical v-if="isVerticalView"  :git="problem.git" :commits="commits" />
          <NetworkHorizontal v-else  :git="problem.git" :commits="commits" />
        </transition>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { 
  Title, 
  Card, 
  NetworkVertical, 
  NetworkHorizontal, 
  IconSwitchHorizontal, 
  IconSwitchVertical,
  Button, 
  Badge } from '@/components'
import { Problem } from "@/problem"
// import { PlainFile, Directory } from '@/git/fileStructure'
// import { Git } from '@/git/git'


export default defineComponent({
  components: {
    Title,
    Card,
    NetworkVertical,
    NetworkHorizontal,
    IconSwitchHorizontal,
    IconSwitchVertical,
    Button,
    Badge
  },
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const isVerticalView = ref(true)
    
    const toggleNetworkView = () => {
      isVerticalView.value = !isVerticalView.value
    }
    
    const branches = computed(() => {
      return props.problem.git?.branches
    })

    const nowHead = ref('master')
    
    const changeHead = (branchName: string) => {
      nowHead.value = branchName
    }

    const commits = computed(() => {
      // 아직 git init을 하지 않은 경우
      if (props.problem.git == null) {
        return []
      }

      // 브랜치 별 결과 출력 준비
      const result = []
        
      // head : 브랜치 이름
      // const head = props.problem.git.head
      const head = nowHead.value

      // headCommitHash : 해당 브랜치의 가장 최근 커밋 해쉬
      const headCommitHash = props.problem.git.branches[head]

      // 커밋 기록이 없는 경우
      if (headCommitHash === '') {
        return []
      }

      // 기준이 될 commit 노드 설정
      const headCommit = props.problem.git.commits[headCommitHash]

      // 검사를 진행할 스택
      const stack = [
        // 해당 커밋 노드의 hash를 포함한 새로운 객체 
        {
          ...headCommit, 
          hash: headCommitHash
        }
      ]
      
      // 스택에서 
      while (stack.length !== 0) {
        const commit = stack.pop()
        result.push(commit)
        for (const parentHash of commit!.parent) {
          const parentCommit = props.problem.git.commits[parentHash]
          stack.push({...parentCommit, hash:parentHash})
        }
      }
      return result
    })

    return {
      commits,
      isVerticalView,
      toggleNetworkView,
      branches,
      changeHead
    }
  },
})
</script>

<style scoped>
.git-graph {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow h-full overflow-y-auto;
}

.git-graph__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}

.swap-enter-active {
}

.swap-leave-active {
}

.swap-enter-from,
.swap-leave-to {
}

.swap-enter-to,
.swap-leave-from {
}
</style>

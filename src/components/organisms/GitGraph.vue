<template>
  <div class="git-graph overflow-y-hidden">
    <div class="bg-gray-200">
      <Title class="git-graph__text">
        커밋 그래프
      </Title>
    </div>
    <Card class="bg-white pb-10 overflow-y-scroll overflow-x-hidden max-h-full">
      <NetworkVertical :git="git" :commits="commits" />
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Title, Card, NetworkVertical } from '@/components'
import { Problem } from "@/problems"
import { PlainFile, Directory } from '@/git/fileStructure'
import { Git } from '@/git/git'


export default defineComponent({
  components: {
    Title,
    Card,
    NetworkVertical
  },
  props:{
    problem:{
      type: Problem,
      required: true,
    },
  },
  setup(props) {
    const presentDir = new Directory('test1')
    const git = new Git(presentDir)
    console.log(git)
    const makeSwitchCommit = (prev: string ,next: string) => {
      git.head = next
      git.branches[next] = git.branches[prev]

      const switchATxt = new PlainFile('switch_a.txt', presentDir)
      git.add()
      git.commit('Add switch text file A')
      
      const switchBTxt = new PlainFile('switch_b.txt', presentDir)
      git.add()
      git.commit('Add switch text file B')
    }
    
    const makeSampleCommit = () => {
      const aTxt = new PlainFile('a.txt', presentDir)
      git.add()
      git.commit('Add text file A')
      const bTxt = new PlainFile('b.txt', presentDir)
      git.add()
      git.commit('Add text file B')

      const cTxt = new PlainFile('c.txt', presentDir)
      git.add()
      git.commit('Add text file C')

      const dTxt = new PlainFile('d.txt', presentDir)
      git.add()
      git.commit('Add text file D')

      // console.log(git)
      return git
    }

    makeSampleCommit()
    makeSwitchCommit('master', 'develop')

    // const commits = computed(() => {
    //   // const { problem } = props
    //   // const { git } = problem
      

    //   // 아직 git init을 하지 않은 경우
    //   if (git == null) {
    //     return []
    //   }

    //   // 브랜치 별 결과 출력 준비
    //   const result: any = []
    //   targetBranchs.forEach(head => {
    //     // 반환할 결과값
        
    //     // head : 브랜치 이름
    //     // const head = git.head

    //     // headCommitHash : 해당 브랜치의 가장 최근 커밋 해쉬
    //     const headCommitHash = git.branches[head]

    //     // 커밋 기록이 없는 경우
    //     if (headCommitHash === '') {
    //       return []
    //     }

    //     // 기준이 될 commit 노드 설정
    //     const headCommit = git.commits[headCommitHash]

    //     // 검사를 진행할 스택
    //     const stack = [
    //       // 해당 커밋 노드의 hash를 포함한 새로운 객체 
    //       {
    //         ...headCommit, 
    //         hash: headCommitHash
    //       }
    //     ]
        
    //     // 스택에서 
    //     while (stack.length !== 0) {
    //       const commit = stack.pop()
    //       result.push(commit)
    //       for (const parentHash of commit!.parent) {
    //         const parentCommit = git.commits[parentHash]
    //         stack.push({...parentCommit, hash:parentHash})
    //       }
    //     }
    //   })
    //   return result
    // })

    const commits = computed(() => {
      // const { problem } = props
      // const { git } = problem
      
      // 아직 git init을 하지 않은 경우
      if (git == null) {
        return []
      }

      // 브랜치 별 결과 출력 준비
      const result = []
        
      // head : 브랜치 이름
      const head = git.head

      // headCommitHash : 해당 브랜치의 가장 최근 커밋 해쉬
      const headCommitHash = git.branches[head]

      // 커밋 기록이 없는 경우
      if (headCommitHash === '') {
        return []
      }

      // 기준이 될 commit 노드 설정
      const headCommit = git.commits[headCommitHash]

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
          const parentCommit = git.commits[parentHash]
          stack.push({...parentCommit, hash:parentHash})
        }
      }
      return result
    })



    return {
      commits,
      git
    }
  },
})
</script>

<style scoped>
.git-graph {
  @apply bg-white rounded-bl-lg rounded-br-lg shadow;
}

.git-graph__text {
  @apply text-sm text-gray-500 rounded-tl-lg rounded-tr-lg bg-white inline-block px-4 py-3;
}
</style>

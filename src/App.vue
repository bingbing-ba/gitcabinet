<template>
  <TheNavBar 
    class="navbar" 
    :problem="problem"
    :problemIndex="problemIndex"
    :lastProblemIndex="lastProblemIndex"
    @goto-prev-problem="gotoPrevProblem"
    @goto-next-problem="gotoNextProblem"
    @reset-problem="resetProblem"
  />
  <main class="main">
    <SectionLeft>
      <ProblemInstruction 
        :problem="problem"
      />
      <ProblemCLI 
        :problem="problem"
      />
      <!-- test용 버튼 -->
      <!-- <button @click="startTest">Sample View</button>
      <button @click="gitAdd">git add</button>
      <button @click="gitCommit">git commit</button> -->
      <!-- test용 버튼 -->
    </SectionLeft>
    <SectionRight>
      <GitDirectory 
        :git="problem.git" 
        @update-file-content="updateFileContent"
        @delete-file="deleteFile">
      </GitDirectory>
      <GitGraph :problem="problem">
      </GitGraph>
    </SectionRight>
    <Divider/>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { problems as problemSet } from '@/problem'
import { 
  Divider, 
  TheNavBar, 
  SectionLeft, 
  SectionRight, 
  ProblemCLI,
  ProblemInstruction,
  GitDirectory,
  GitGraph,
} from '@/components'
import { PlainFile, Directory } from '@/git/fileStructure'
import { Git } from '@/git/git'

export default defineComponent({
  components: {
    Divider,
    TheNavBar,
    SectionLeft,
    SectionRight,
    ProblemCLI,
    ProblemInstruction,
    GitDirectory,
    GitGraph,
  },
  setup() {
    const problemIndex = ref(0)
    const problems = reactive(problemSet)
    
    const lastProblemIndex = problems.length
    const problem = computed(()=>{
      return problems[problemIndex.value]
    })

    const resetProblem = () => {
    }
    const gotoPrevProblem = () => {
      problemIndex.value -= 1
    }
    const gotoNextProblem = () => {
      problemIndex.value += 1
    }

    const updateFileContent = (content: string, index: number) => {
      problems[problemIndex.value].refDirectory.children[index].content = content
    }

    const deleteFile = (file: PlainFile) => {
      problems[problemIndex.value].refDirectory.delete(file)
    }
    
    // ~ 테스팅용 샘플 git 설정 
    const presentDir = new Directory('test1')
    const git = new Git(presentDir)
    git.setUserConfig(
      {
        type: 'name',
        name: 'tony'
      }
    )
    git.setUserConfig(
      {
        type: 'email',
        email: 'tony@tony.com'
      }
    )
    const startTest = () => {
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
        git.add(presentDir.getChildrenName())
        git.commit('Add text file A')
        const bTxt = new PlainFile('b.txt', presentDir)
        git.add(presentDir.getChildrenName())
        git.commit('Add text file B')
        const cTxt = new PlainFile('c.txt', presentDir)
        git.add(presentDir.getChildrenName())
        git.commit('Add text file C')
        const dTxt = new PlainFile('d.txt', presentDir)
        git.add(presentDir.getChildrenName())
        git.commit('Add text file D')
        return git
      }
      makeSampleCommit()
      makeSwitchCommit('master', 'develop')
      problems[0].refDirectory = presentDir
      problems[0].git = git

      const eTxt = new PlainFile('e.txt', presentDir)
    }

    const gitAdd = () => {
      problems[0].git?.add()
    }

    const gitCommit = () => {
      problems[0].git?.commit('test commit')
    }
    // ~
    
    return {
      problemIndex,
      lastProblemIndex,
      resetProblem,
      gotoPrevProblem,
      gotoNextProblem,

      problem,
      updateFileContent,
      deleteFile,
      // ~ test용 method
      startTest,
      gitAdd,
      gitCommit
      // ~
    }
  },
})
</script>

<style>
#app {
  font-family: 'Noto Sans KR', Helvetica, Arial, sans-serif;
}

.navbar {
  @apply absolute w-full bg-gray-100;
}

.main {
  @apply grid grid-cols-2 bg-gray-200 h-screen pt-16;
}
</style>

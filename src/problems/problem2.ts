import { Problem } from "@/problem"
import { PlainFile } from "@/git/fileStructure"
import { Git } from "@/git/git"

export const problem2 = new Problem('staging 하기')
problem2.content = `이 디렉토리는 git으로 관리되고 있습니다.
디렉토리의 README.txt를 staging area에 올리려합니다.
git status를 통해 현재 상태를 확인해보세요.
git add README.txt를 통해 README.txt를 staging 해보세요.`
new PlainFile('README.txt', problem2.refDirectory)
problem2.setGit(new Git(problem2.refDirectory))
problem2.setBase()
problem2.setAnswer((_, git)=>{
  if (git) {
    return Object.keys(git.index).includes('README.txt') 
  }
  return false
})











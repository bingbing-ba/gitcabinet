import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem2BasicAdd = new Problem('staging 하기')
problem2BasicAdd.content = `이 디렉토리는 git으로 관리되고 있습니다.
디렉토리의 README.txt를 staging area에 올리려합니다.
*$ git status*를 통해 현재 상태를 확인해보세요.
*$ git add README.txt*를 통해 README.txt를 staging 해보세요.`
const fileReadme = new PlainFile('README.txt', problem2BasicAdd.refDirectory)

// 문제에 맞게 git add 만 하면 되도록 미리 git init해둠
problem2BasicAdd.setGit()
problem2BasicAdd.setBase()
problem2BasicAdd.setAnswer((_, git)=>{
  if (git) {
    // index(staging area)에 README.txt가 존재한다면 add한 것으로 판단!
    return git.isExistAtIndex(fileReadme)
  }
  return false
})










import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem3BasicCommit = new Problem('commit 남기기')
problem3BasicCommit.content = 
`현재 디렉토리의 README.txt가 staging area에 추가되어있습니다.
*$ git status*를 통해 현재 상태를 확인해보세요.
*$ git commit -m '커밋 메시지'* 통해서 메세지를 남길 수 있습니다.`
const readme = new PlainFile('README.txt', problem3BasicCommit.refDirectory)
problem3BasicCommit.setGit()
problem3BasicCommit.git!.add()
problem3BasicCommit.setBase()
problem3BasicCommit.setAnswer((_, git)=>{
  if (git) {
    return git.isExistAtRecentCommit(readme)
  }
  return false
})

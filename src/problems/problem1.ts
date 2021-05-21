import { Problem } from "@/problems/problem"
import { PlainFile } from "@/git/fileStructure";

export const problem1 = new Problem('Git 초기화하기')
new PlainFile('README.txt', problem1.refDirectory)
problem1.content = '지금부터 이 디렉토리를 git으로 관리하려고 합니다. 아래의 명령어를 참고하여 문제를 해결하세요!'
problem1.setAnswer((refDirectory, git)=>{
  if(git?.refDirectory === refDirectory) {
    return true
  }
  return false
})
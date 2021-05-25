import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem1Init = new Problem('Git 초기화하기')

// 사실 문제 목적이랑은 상관없는 그냥 파일
new PlainFile('README.txt', problem1Init.refDirectory)
problem1Init.content = `지금부터 이 디렉토리를 git으로 관리하려고 합니다. 
아래의 명령어를 참고하여 문제를 해결하세요!`
problem1Init.setAnswer((refDirectory, git)=>{
  // 만약 git이 problem1에 설정되어있고, 그 refDirectory가 문제의 디렉토리와 같다면?
  // git init을 했다고 판단할 수 있음
  if(git?.refDirectory === refDirectory) {
    return true
  }
  return false
})
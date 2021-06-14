import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem1Init = new Problem('Git 초기화하기')

// 사실 문제 목적이랑은 상관없는 그냥 파일
new PlainFile('README.txt', problem1Init.refDirectory)
problem1Init.content = `지금부터 이 디렉토리를 git 저장소로 관리하려고 합니다. 
*$ git init* 을 통해 이 디렉토리를 git 저장소로 초기화 해보세요!`
problem1Init.explanation = `git은 디렉토리 내부의 변경 이력을 관리하는 일을 합니다.
변경 이력을 관리하면, 저장소가 어떻게 변해왔는지 확인하거나 특정 시점의 파일로 돌아가는 일 등을 할 수 있습니다.
또, 여러명이 같은 파일로 작업할 때 무엇이 바뀌었는지 확인하기도 좋습니다.`
problem1Init.setAnswer((refDirectory, git)=>{
  // 만약 git이 problem1에 설정되어있고, 그 refDirectory가 문제의 디렉토리와 같다면?
  // git init을 했다고 판단할 수 있음
  if(git?.refDirectory === refDirectory) {
    return true
  }
  return false
})
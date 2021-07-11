import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const problem1Init = new Problem('Git 초기화하기')

// 사실 문제 목적이랑은 상관없는 그냥 파일
const readme = new PlainFile('README.txt', problem1Init.refDirectory)
readme.content = 'Git 초기화 하기'
problem1Init.content = `지금부터 이 디렉토리를 git 저장소로 관리하려고 합니다. 
*$ git init* 을 통해 이 디렉토리를 git 저장소로 초기화 해보세요!`
problem1Init.explanation = `git으로 관리되는 디렉토리를 저장소, 영어로는 repository, 줄여서 repo(리포)라고 합니다. 

repo에서 *$ git status* 를 입력하면 발생한 변경사항을 확인할 수 있습니다.
*추적하지 않는 파일* 에 나타나는 파일들은 아직 git에서 관리한 적이 없는, 새로 등장한 파일들입니다.`
problem1Init.setAnswer((refDirectory, git) => {
  // 만약 git이 problem1에 설정되어있고, 그 refDirectory가 문제의 디렉토리와 같다면?
  // git init을 했다고 판단할 수 있음
  if (git?.refDirectory === refDirectory) {
    return true
  }
  return false
})
problem1Init.setDefaultQueue([visualizationArea.GitDirectory])

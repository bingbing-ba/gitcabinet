import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const problem2BasicAdd = new Problem('staging 하기')
problem2BasicAdd.content = `이 git 저장소에 두 파일이 새롭게 추가되었습니다(오른쪽 디렉토리 영역). 추가된 파일 중, *staging.txt* 를 staging area에 추가해주세요.`
problem2BasicAdd.explanation = `git으로 변경 이력을 남기려면, 먼저 어떤 변경사항을 기록할지를 *선택*해야 합니다. 
이 선택과정을 staging이라고 합니다. *$ git add 파일이름*을 통해 원하는 파일을 staging할 수 있습니다. 선택된 변경사항은 staging area(오른쪽 Staging Area 영역)라는 곳에 존재하게 됩니다.

*$ git add 파일이름* 을 통해 원하는 파일을 staging area에 추가할 수 있습니다.
*커밋할 변경 사항*에 나타나는 파일들은 staging area에 추가되어서 기록할 준비가 된 파일들입니다.`

const staging = new PlainFile('staging.txt', problem2BasicAdd.refDirectory)
staging.content = '이 파일을 staging 합니다.'
const unstaging = new PlainFile('unstaging.txt', problem2BasicAdd.refDirectory)
unstaging.content = '이 파일은 staging 하지 않아요.'
// 문제에 맞게 git add 만 하면 되도록 미리 git init해둠
problem2BasicAdd.setGit()
problem2BasicAdd.setBase()
problem2BasicAdd.setAnswer((_, git) => {
  if (git) {
    // index(staging area)에 README.txt가 존재한다면 add한 것으로 판단!
    return git.isExistAtIndex(staging) && !git.isExistAtIndex(unstaging)
  }
  return false
})

problem2BasicAdd.setDefaultQueue([visualizationArea.GitStagingArea, visualizationArea.GitDirectory])

import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const problem5AddAdvanced = new Problem('한번에 여러 파일 staging하기')

problem5AddAdvanced.content = `지금 이 저장소에 발생한 모든 변경사항을 staging area에 추가해주세요.`
problem5AddAdvanced.explanation = `한번에 여러 변경사항을 staging area에 추가하는 방법을 알아보겠습니다.
*$ git add 첫번째파일이름 두번째파일이름 ...* 으로 여러 변경사항을 추가할 수 있습니다.
또는, *$ git add .* 으로 현재 위치에서 발생한 모든 변경사항을 추가할 수 있습니다.
먼저 *$ git status* 를 통해 발생한 변경사항을 확인해보세요.`

const modified = new PlainFile('modified.txt', problem5AddAdvanced.refDirectory)
const deleted = new PlainFile('deleted.txt', problem5AddAdvanced.refDirectory)
const untracked1 = new PlainFile(
  'untracked1.txt',
  problem5AddAdvanced.refDirectory
)
const untracked2 = new PlainFile(
  'untracked2.txt',
  problem5AddAdvanced.refDirectory
)
problem5AddAdvanced.setGit()
problem5AddAdvanced.git?.setUserConfig({ name: 'bing', type: 'name' })
problem5AddAdvanced.git?.setUserConfig({
  email: 'bing@bing.com',
  type: 'email',
})

problem5AddAdvanced.git?.add([modified.filename, deleted.filename])
problem5AddAdvanced.git?.commit('initial commit')
modified.content = '수정된 내용'
problem5AddAdvanced.refDirectory.delete(deleted)
problem5AddAdvanced.setBase()
problem5AddAdvanced.setAnswer((_, git) => {
  if (git) {
    return (
      git.isExistAtIndex([modified, untracked1, untracked2]) &&
      !git.isExistAtIndex(deleted)
    )
  }
  return false
})
visualizationArea
problem5AddAdvanced.setDefaultQueue([visualizationArea.GitStagingArea, visualizationArea.GitDirectory])

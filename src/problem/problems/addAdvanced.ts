import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const addAdvanced = new Problem('한번에 여러 파일 staging하기')

addAdvanced.content = `지금 이 저장소에 발생한 모든 변경사항을 staging area에 추가해주세요.`
addAdvanced.explanation = `한번에 여러 변경사항을 staging area에 추가하는 방법을 알아보겠습니다.
*$ git add 첫번째파일이름 두번째파일이름 ...* 으로 여러 변경사항을 추가할 수 있습니다.
또는, *$ git add .* 으로 현재 위치에서 발생한 모든 변경사항을 추가할 수 있습니다.
먼저 *$ git status* 를 통해 발생한 변경사항을 확인해보세요.`

const modified = new PlainFile('modified.txt', addAdvanced.refDirectory)
const deleted = new PlainFile('deleted.txt', addAdvanced.refDirectory)
const untracked1 = new PlainFile(
  'untracked1.txt',
  addAdvanced.refDirectory
)
const untracked2 = new PlainFile(
  'untracked2.txt',
  addAdvanced.refDirectory
)
untracked1.content = '이 파일은 staging 된 적이 없는 파일입니다.'
untracked2.content = '이 파일은 staging 된 적이 없는 파일입니다.'
addAdvanced.setGit()
addAdvanced.git?.setUserConfig({ name: 'bing', type: 'name' })
addAdvanced.git?.setUserConfig({
  email: 'bing@bing.com',
  type: 'email',
})

addAdvanced.git?.add([modified.filename, deleted.filename])
addAdvanced.git?.commit('modified.txt와 deleted.txt 파일 추가')
modified.content = '이 파일은 내용이 수정되었어요.'
addAdvanced.refDirectory.delete(deleted)
addAdvanced.setBase()
addAdvanced.setAnswer((_, git) => {
  if (git) {
    return (
      git.isExistAtIndex([modified, untracked1, untracked2]) &&
      !git.isExistAtIndex(deleted)
    )
  }
  return false
})
visualizationArea
addAdvanced.setDefaultQueue([visualizationArea.GitStagingArea, visualizationArea.GitDirectory])

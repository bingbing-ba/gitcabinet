import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const problem3BasicCommit = new Problem('commit 남기기')
problem3BasicCommit.content = `이 저장소의 staging area에 *staging.txt* 가 추가되어 있습니다. 해당 변경사항을 commit하세요.`
problem3BasicCommit.explanation = `staging area에 추가된 변경사항을 기록하는 일, 혹은 그 기록을 commit 이라고 합니다.

먼저 *$ git status* 를 통해 *staging.txt* 가 staging area에 추가되어있는 모습을 확인하세요. 혹은 오른쪽의 Staging Area를 확인하세요.

*$ git commit -m '메세지 내용'* 을 통해서 적당한 메세지와 함께 commit을 남길 수 있습니다.
commit 후에 다시 *$ git status* 를 통해 상태를 확인해보세요. *staging.txt* 의 변경사항은 기록되었기 때문에 status에 출력되지 않는 것을 확인하실 수 있습니다.`
const staging = new PlainFile('staging.txt', problem3BasicCommit.refDirectory)
staging.content = '이 파일은 commit할 준비가 되었어요.'
const unstaging = new PlainFile(
  'unstaging.txt',
  problem3BasicCommit.refDirectory
)
unstaging.content = '이 파일은 staging되지 않았기 때문에 commit 되지 않아요.'
problem3BasicCommit.setGit()
problem3BasicCommit.git!.add([staging.filename])
problem3BasicCommit.setBase()
problem3BasicCommit.setAnswer((_, git) => {
  if (git) {
    return (
      git.isExistAtRecentCommit(staging) &&
      !git.isExistAtRecentCommit(unstaging)
    )
  }
  return false
})
problem3BasicCommit.setDefaultQueue([visualizationArea.GitGraph, visualizationArea.GitStagingArea])

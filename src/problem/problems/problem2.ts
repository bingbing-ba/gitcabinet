import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem2BasicAdd = new Problem('staging 하기')
problem2BasicAdd.content = `이 git 저장소에 두 파일이 새롭게 추가되었습니다. 추가된 파일 중, *staging.txt* 를 staging area에 추가해주세요.`
problem2BasicAdd.explanation = `git으로 변경 이력을 남기려면, 먼저 어떤 변경사항을 기록할지를 선택해야 합니다. 선택된 변경사항은 staging area라는 곳에 존재하게 되고, 나중에 staging area에 존재하는 변경사항을 기록하게 됩니다. 이 문제에서는 먼저 변경사항을 staging area에 추가합니다.
*$ git status* 를 입력하면 저장소에 현재 어떤 변경점이 있는지를 확인할 수 있습니다. 
*추적하지 않는 파일* 에 나타나는 파일들은 아직 git에서 관리한 적이 없는, 새로 등장한 파일들입니다.
*$ git add 파일이름* 을 통해 원하는 파일을 staging area에 추가할 수 있습니다. *staging.txt* 만 staging area에 추가하고, 다시 *$ git status* 를 통해 어떤 변화가 있는지 확인해보세요.
*커밋할 변경 사항*에 나타나는 파일들은 staging area에 추가되어서 기록할 준비가 된 파일들입니다.`

const staging = new PlainFile('staging.txt', problem2BasicAdd.refDirectory)
const unstaging = new PlainFile('unstaging.txt', problem2BasicAdd.refDirectory)
// 문제에 맞게 git add 만 하면 되도록 미리 git init해둠
problem2BasicAdd.setGit()
problem2BasicAdd.setBase()
problem2BasicAdd.setAnswer((_, git)=>{
  if (git) {
    // index(staging area)에 README.txt가 존재한다면 add한 것으로 판단!
    return git.isExistAtIndex(staging) && !git.isExistAtIndex(unstaging)
  }
  return false
})

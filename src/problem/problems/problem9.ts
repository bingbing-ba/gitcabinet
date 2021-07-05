import { Problem } from '@/problem/problem'
import { Directory, PlainFile } from '@/git/fileStructure'
import { Git } from '@/git/git'

export const problem9PullFromRemote = new Problem('원격 저장소에서 pull하기')

problem9PullFromRemote.content = `현재 이 저장소에는 *README.md* 를 기록한 하나의 commit 만이 존재합니다. 원격 저장소에는 해당 commit 이후에 *pull.txt* 를 기록한 또다른 commit이 존재합니다. 즉 두 개의 commit이 존재합니다.
원격 저장소의 commit을 이 저장소로 pull 해주세요!
해당 원격 저장소는 이 저장소에 *origin* 으로 등록되어 있습니다.`
problem9PullFromRemote.explanation = `원격 저장소의 내용을 내 컴퓨터의 저장소에 내려받는 것을 *pull* 이라고 합니다. *clone* 과 다른 점은, *clone* 은 내 컴퓨터에 저장소가 존재하지 않고, *pull* 은 저장소가 존재한다는 점 입니다. 덧붙이면,
*pull*은 이미 내 컴퓨터에 git 저장소가 존재하는데, 원격 저장소의 내용으로 내 저장소를 업데이트 하고싶을 때 사용합니다.
*clone*은 내 컴퓨터에 저장소가 존재하지 않고, 새로 저장소를 만들어 원격 저장소의 내용을 가져오고 싶을 때 사용합니다. 
명령어 *$ git pull origin master* 로 *pull* 하실 수 있습니다.
여기서 *origin* 은 미리 등록해둔 원격 저장소의 주소입니다.
*master* 는 *master* 라는 브랜치인데, 여기서는 '내 컴퓨터로' 정도로 해석해도 충분합니다. 이후에 브랜치 문제에서 자세히 설명하겠습니다.
그래서 위의 명령어는 "원격 저장소 *origin* 의 내용을 내 컴퓨터로 가져와 업데이트 하겠다." 정도로 해석가능합니다.`

problem9PullFromRemote.setGit()
problem9PullFromRemote.git?.setUserConfig({ name: 'bing', type: 'name' })
problem9PullFromRemote.git?.setUserConfig({
  email: 'bing@bing.com',
  type: 'email',
})
const README = new PlainFile('README.md', problem9PullFromRemote.refDirectory)
problem9PullFromRemote.git?.add()
problem9PullFromRemote.git?.commit('initial commit')
const origin = new Git(new Directory('origin'))
origin.setUserConfig({ name: 'bing', type: 'name' })
origin.setUserConfig({ email: 'bing@bing.com', type: 'email' })
problem9PullFromRemote.git?.addRemote('origin', origin)
problem9PullFromRemote.git?.push('origin', 'master')
const pull = new PlainFile('pull.txt', origin.refDirectory)
origin.add()
const { hash } = origin.commit('add pull.txt')
problem9PullFromRemote.setBase()
problem9PullFromRemote.setAnswer((_, git) => {
  if (git) {
    return git.branches[git.head] === hash
  }
  return false
})
problem9PullFromRemote.setDefaultQueue([1, 3])

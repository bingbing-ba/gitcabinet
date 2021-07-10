import { Problem } from '@/problem/problem'
import { Directory, PlainFile } from '@/git/fileStructure'
import { Git } from '@/git/git'
import { isEqual } from 'lodash'
import { visualizationArea } from '../viewTypes'

export const problem8PushToRemote = new Problem('원격 저장소에 push하기')

problem8PushToRemote.content = `현재 이 저장소에는 두 개의 commit이 존재합니다. 원격 저장소 *origin* 에는 아무런 commit도 존재하지 않습니다. origin은 이미 이 저장소에 등록되어있습니다. 두 개의 commit을 origin에 *push*하세요!`
problem8PushToRemote.explanation = `저장소의 commit을 원격 저장소에 업로드 하는 것을 *push* 라고 합니다.
명령어 *$ git push origin master* 를 통해서 push가 가능합니다. 
명령어를 해석하면, 저장소의 commit을 *origin*이라는 원격 저장소에 업로드하겠다는 의미가 됩니다.

여기서 *master* 는 *master* 라는 브랜치를 의미하는데, 지금 시점에서는 repo의 commit들 정도로 해석하시면 됩니다. 엄밀하게 보면 틀린 말이지만, 여기서는 넘어가도 괜찮습니다. 이후 브랜치를 다루는 문제에서 다시 자세히 설명하겠습니다.`

problem8PushToRemote.setGit()
problem8PushToRemote.git?.setUserConfig({ name: 'bing', type: 'name' })
problem8PushToRemote.git?.setUserConfig({
  email: 'bing@bing.com',
  type: 'email',
})
const a = new PlainFile('a.txt', problem8PushToRemote.refDirectory)
const b = new PlainFile('b.txt', problem8PushToRemote.refDirectory)
problem8PushToRemote.git?.add([a.filename])
problem8PushToRemote.git?.commit('add a.txt')
problem8PushToRemote.git?.add([b.filename])
problem8PushToRemote.git?.commit('add b.txt')
const origin = new Git(new Directory('origin@origin.com'))
problem8PushToRemote.git?.addRemote('origin', origin)
problem8PushToRemote.setBase()
problem8PushToRemote.setAnswer((_, git) => {
  if (git) {
    return isEqual(git.config.remote['origin'].commits, git.commits)
  }
  return false
})
problem8PushToRemote.setDefaultQueue([visualizationArea.GitRemote, visualizationArea.GitGraph])

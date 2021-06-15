import { Problem } from '@/problem/problem'
import { Directory, PlainFile } from '@/git/fileStructure'
import { Git } from '@/git/git'
import { isEqual } from 'lodash'

export const problem8PushToRemote = new Problem('원격 저장소에 push하기')

problem8PushToRemote.content = `현재 이 저장소에는 두 개의 commit이 존재합니다. 원격 저장소 *origin* 에는 아무런 commit도 존재하지 않습니다. 두 개의 commit을 원격 저장소에 *push*하세요!`
problem8PushToRemote.explanation = `내 컴퓨터에 쌓인 commit을 원격 저장소에 업로드 하는 것을 *push* 라고 합니다.
명령어 *$ git push origin master* 를 통해서 push가 가능합니다. 
여기서 *origin* 은 이전 문제에서 등록했던 원격 저장소 주소의 별명입니다. 만약  *origin* 이 어떤 주소를 가리키고 있는지 확인하고 싶다면, 명령어 *$ git remote -v* 를 통해서 알 수 있습니다. 물론 *push* 할 때마다 확인하실 필요는 없고, 필요할 때만 사용하시면 됩니다.
뒤의 *master* 는 *master* 라는 브랜치를 의미하는데, 지금 시점에서는 *master* 브랜치를 내 컴퓨터의 commit들로 해석하시면 됩니다. 엄밀하게 보면 틀린 말이지만, 여기서는 넘어가도 괜찮습니다. 이후 브랜치를 다루는 문제에서 다시 자세히 설명하겠습니다.
명령어를 해석하면, 내 컴퓨터의 commit을 *origin*이라는 원격 저장소에 업로드하겠다는 의미가 됩니다.`

problem8PushToRemote.setGit()
problem8PushToRemote.git?.setUserConfig({name:'bing', type:'name'})
problem8PushToRemote.git?.setUserConfig({email:'bing@bing.com', type:'email'})
const a = new PlainFile('a.txt', problem8PushToRemote.refDirectory)
const b = new PlainFile('b.txt', problem8PushToRemote.refDirectory)
problem8PushToRemote.git?.add([a.filename])
problem8PushToRemote.git?.commit('add a.txt')
problem8PushToRemote.git?.add([b.filename])
problem8PushToRemote.git?.commit('add b.txt')
const origin = new Git(new Directory('origin@origin.com'))
problem8PushToRemote.git?.addRemote('origin', origin)
problem8PushToRemote.setBase()
problem8PushToRemote.setAnswer((_, git)=>{
  if(git){
    return isEqual(git.config.remote['origin'].commits, git.commits) 
  }
  return false
})
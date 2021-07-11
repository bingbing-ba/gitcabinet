import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { Git } from '@/git/git'
import { visualizationArea } from '../viewTypes'

export const problem7Remote = new Problem('원격 저장소 등록하기')

problem7Remote.content = `이 저장소에 *origin* 이라는 이름으로 *https://github.com/bingbing-ba/gitcabinet.git* 의 원격 저장소를 등록해주세요! 원격 저장소는 이미 만들어진 상태라고 가정합니다.`
problem7Remote.explanation = `원격 저장소는 다른 곳에 존재하는 백업 형태의 저장소를 말합니다. 
보통 원격 저장소는 제공되는 서비스(github 등)를 통해 만듭니다. github.com에서 어렵지 않게 원격 저장소를 만드실 수 있습니다. 원격 저장소를 만들고나면 해당 원격 저장소의 주소가 생성되는데, 이 주소를 내 컴퓨터의 저장소와 연결하여 사용할 수 있습니다.

이 문제에서는 이미 원격 저장소가 만들어진 상태라 생각하고, 연결하는 일만 합니다.
만들어진 원격 저장소의 주소는 *https://github.com/bingbing-ba/gitcabinet.git* 입니다.
*$ git remote add origin 원격저장소주소* 를 통해 이 repo에 원격 저장소를 등록할 수 있습니다. 중간의 *origin*은 원격 저장소 주소를 간편하게 쓰기 위한 별명이라고 생각하면 됩니다. 이 별명은 *origin* 이 아니라 다르게도 사용할 수 있지만, 관례적으로 *origin* 으로 사용합니다.`

problem7Remote.setGit()
problem7Remote.git?.setUserConfig({ name: 'bing', type: 'name' })
problem7Remote.git?.setUserConfig({ email: 'bing@bing.com', type: 'email' })
new PlainFile('remote.txt', problem7Remote.refDirectory)
new PlainFile('origin.txt', problem7Remote.refDirectory)
problem7Remote.git?.add()
problem7Remote.git?.commit('처음 remote.txt와 origin.txt를 추가')
problem7Remote.setBase()
problem7Remote.setAnswer((_, git) => {
  if (git) {
    return git.config.remote['origin'] instanceof Git
  }
  return false
})
problem7Remote.setDefaultQueue([visualizationArea.GitRemote, visualizationArea.GitGraph])

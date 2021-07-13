import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const userConfig = new Problem('user config 등록하기')
userConfig.content = `이 저장소에
- 이름: *bing*
- 이메일주소: *bing@bing.com*
의 유저 정보를 설정해주세요.`
userConfig.explanation = `Git 저장소에 기록을 남기기 위해서는 먼저 유저 정보 설정이 되어있어야 합니다.

*$ git config user.name '작성자 이름'* 으로 작성자 이름을, 
*$ git config user.email '이메일주소'* 으로 이메일 주소를 설정할 수 있습니다.
설정한 이름과 이메일 주소를 확인하고 싶다면 맨 뒤의 인자를 빼고
*$ git config user.name*
*$ git config user.email*
으로 확인할 수 있습니다.

따옴표는 보통 중간에 공백이 포함되는 경우에 사용하며, 공백이 없다면 아래와 같이 생략할 수 있습니다.
예시) *$ git config user.name Tony*`

const withUserConfig = new PlainFile(
  'with_user_config.txt',
  userConfig.refDirectory
)
withUserConfig.content = '작성자 정보를 설정해주세요'
userConfig.setGit()
userConfig.setBase()
userConfig.setAnswer((_, git) => {
  if (git) {
    const isUserCorrect =
      git.config.user.email === 'bing@bing.com' &&
      git.config.user.name === 'bing'
    
    return isUserCorrect
  }
  return false
})
userConfig.setDefaultQueue([visualizationArea.GitGraph, visualizationArea.GitDirectory])

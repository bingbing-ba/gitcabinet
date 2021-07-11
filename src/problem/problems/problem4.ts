import { Problem } from '@/problem/problem'
import { PlainFile } from '@/git/fileStructure'
import { visualizationArea } from '../viewTypes'

export const problem4UserConfig = new Problem('user config 등록하기')
problem4UserConfig.content = `이 저장소에 새로 추가된 *with_user_config.txt* 라는 파일을
- 이름: *bing*
- 이메일주소: *bing@bing.com*
의 작성자 정보를 가지도록 commit을 남겨주세요. commit을 남기기 전에 작성자 정보 설정이 선행되어야 합니다.`
problem4UserConfig.explanation = `commit에는 commit을 남긴 작성자 정보가 함께 기록됩니다. 저장소에 한 번 작성자 정보를 설정하면, 이후의 commit에는 해당 작성자 정보가 항상 남게 됩니다. 작성자 정보를 설정하고, commit을 남겨보겠습니다!

*$ git config user.name '작성자 이름'* 으로 작성자 이름을, 
*$ git config user.email '이메일주소'* 으로 이메일 주소를 설정할 수 있습니다.
설정한 이름과 이메일 주소를 확인하고 싶다면 맨 뒤의 인자를 빼고
*$ git config user.name*
*$ git config user.email*
으로 확인할 수 있습니다.

만약 컴퓨터의 모든 git 저장소에서 같은 작성자 정보를 유지하고 싶다면 —global 키워드를 붙여 아래와 같이 사용할 수 있습니다.
*$ git config --global user.name '작성자 이름'*
*$ git config --global user.email '이메일주소'*
따옴표는 보통 중간에 공백이 포함되는 경우에 사용하며, 공백이 없다면 아래 같이 생략할 수 있습니다.
예시) *$ git config user.name Tony*

추가로 문제 해결을 위해서
*$ git add 파일이름*
*$ git commit -m '커밋 메세지'*
를 참고하세요.`
const withUserConfig = new PlainFile(
  'with_user_config.txt',
  problem4UserConfig.refDirectory
)
withUserConfig.content = '문제의 작성자 정보를 먼저 설정하고 commit 해주세요.'
problem4UserConfig.setGit()
problem4UserConfig.setBase()
problem4UserConfig.setAnswer((_, git) => {
  if (git) {
    const isUserConfigExists =
      git.config.user.email === 'bing@bing.com' &&
      git.config.user.name === 'bing'
    const recentCommit = git.getMostRecentCommit()
    const isEmailMatched = recentCommit?.author.email === git.config.user.email
    const isNameMatched = recentCommit?.author.name === git.config.user.name
    return !!(isUserConfigExists && isEmailMatched && isNameMatched)
  }
  return false
})
problem4UserConfig.setDefaultQueue([visualizationArea.GitGraph, visualizationArea.GitDirectory])

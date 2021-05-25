import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem4UserConfig = new Problem('user config 등록하기')
problem4UserConfig.content = 
`commit에는 미리 설정한 작성자 정보가 함께 기록됩니다.
git config user.name '이름' 으로 commit 작성자의 이름을,
git config user.email '이메일주소' 으로 이메일주소를 설정할 수 있습니다.
위 명령어는 이 저장소에만 적용되는 설정입니다..
만약 컴퓨터의 모든 저장소에 적용되는 설정을 하려면
git config --global user.name '이름' 처럼 각 명령어에 --global 키워드를 붙여주세요.
user config 설정 이후 README.txt를 commit하여 작성자 정보를 확인하세요.
git add 파일이름 과
git commit -m '메세지' 를 활용하세요.`
const README = new PlainFile('README.txt', problem4UserConfig.refDirectory)
problem4UserConfig.setGit()
problem4UserConfig.setBase()
problem4UserConfig.setAnswer((_, git)=>{
  if (git) {
    const isUserConfigExists = git.config.user.email && git.config.user.name
    const recentCommit = git.getMostRecentCommit()
    const isEmailMatched = recentCommit?.author.email === git.config.user.email
    const isNameMatched = recentCommit?.author.name === git.config.user.name
    return !!(isUserConfigExists && isEmailMatched && isNameMatched)
  }
  return false
})
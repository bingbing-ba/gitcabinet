import { Problem } from "@/problem/problem"
import { PlainFile } from "@/git/fileStructure"

export const problem6AddCommitPractice = new Problem('add, commit 실습하기')

problem6AddCommitPractice.content = `저장소에 존재하는 네 파일 중, 하나의 파일은 이전 commit과 비교하여 파일 내용이 수정되었고, 나머지 파일은 새로 생성되었습니다. 먼저 수정된 파일을 commit하고, 다음 commit에는 나머지 파일들을 모두 추가해주세요.
*$ git status* 를 통해 문제해결에 도움을 얻을 수 있습니다.`
problem6AddCommitPractice.explanation = `아래의 명령어를 참고하세요.
*$ git add 파일이름*
*$ git commit -m '커밋 메세지'*
어떤 파일이 수정되었는지를 확인하기 위해서 *$ git status* 를 활용하세요.`

const modified = new PlainFile('modified.txt', problem6AddCommitPractice.refDirectory)
const untracked1 = new PlainFile('untracked1.txt', problem6AddCommitPractice.refDirectory)
const untracked2 = new PlainFile('untracked2.txt', problem6AddCommitPractice.refDirectory)
const untracked3 = new PlainFile('untracked3.txt', problem6AddCommitPractice.refDirectory)
problem6AddCommitPractice.setGit()
problem6AddCommitPractice.git?.setUserConfig({name:'bing', type:'name'})
problem6AddCommitPractice.git?.setUserConfig({email:'bing@bing.com', type:'email'})
problem6AddCommitPractice.git?.add([modified.filename])
problem6AddCommitPractice.git?.commit('add modified')
modified.content = '수정된 내용'
problem6AddCommitPractice.setBase()
problem6AddCommitPractice.setAnswer((_, git)=>{
  if(git){
    const headCommitHash = git.branches[git.head]
    const isAllCommitted = git.isExistAtCommit([modified, untracked1, untracked2, untracked3], headCommitHash)
    const parentCommitHash = git.getMostRecentCommit()!.parent[0]
    const isModifiedCommittedFirst = git.isExistAtCommit(modified, parentCommitHash)
    return isAllCommitted && isModifiedCommittedFirst
  }
  return false
})


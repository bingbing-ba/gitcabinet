import { Problem } from '@/problem/problem'
import { Git } from '@/git/git'

export const cli = (command: string, problem:Problem) => {
  
  if (command.includes('"')){
    return `현재 "(double quote)는 허용하지 않습니다. 
    대신 '(single quote)를 사용해주세요`
  }
  
  const splitedCommand = command
    .replace(/ +(?= )/g, '') // remove consecutive spaces
    .trim()
    .match(/(?:[^\s']+|'[^']*')+/g) as string [] 
    // split with space but ignore space in quote
  const [firstCommand, secondCommand, ...restCommand] = splitedCommand

  let resultString = ''
  if (firstCommand === 'git') {
    if (secondCommand === undefined) {
      resultString = `현재 사용가능한 명령어는
      git init
      git add
      git commit
      git config
      git status
      입니다.`
      return resultString
    }
    const subCommands: {[key:string]:Function} = {
      init(globalConfig?:{name:string, email:string}){
        if (problem.git) {
          resultString = '기존 저장소를 다시 초기화 하려고 하셨습니다.'
          return
        }
        const git = new Git(problem.refDirectory)
        problem.setGit(git, globalConfig)
        resultString = '저장소를 초기화 하였습니다.'
      },

      add(...filenames: string []){
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        if (filenames.length === 0) {
          resultString = `아무 파일도 지정하지 않았으므로 아무 것도 추가하지 않습니다.
          혹시 'git add .' 명령어를 실행하려고 했나요?`
          return
        }
        if (filenames.length === 1 && filenames[0] === '.'){
          problem.git.add()
          return
        }
        problem.git.add(filenames) 
        // 실제로는 없는 파일을 add하면 에러가 발생하지만, 
        // 여기에서는 없는 파일을 제외하고 add되도록 구현되어 있습니다.
      },

      commit(option:string, message?:string){
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        if (problem.git.getUserConfig({type:'email'}) === '') {
          resultString = `commit 작성자가 누군지 설정되어 있지 않습니다. 
          git config user.name 'your name'
          git config user.email your@email.com
          으로 먼저 설정한다음 commit하세요.`
          return
        }
        if (option !== '-m') {
          resultString = `잘못된 commit 옵션입니다. 'git commit -m ${message ?? '메세지'}'를 쓰려고 하셨나요?`
          return
        }
        if (message === undefined || message === '') {
          resultString = `commit message가 비어있습니다`
          return
        }
        problem.git.commit(message)
        resultString = 'commit이 완료되었어요'
      },

      config(type:string, value?:string){
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        if (type==='user.name') {
          if (value===undefined) {
            resultString = problem.git.getUserConfig({type:'name'})
            return
          }
          problem.git.setUserConfig({type:'name', name:value})
          return
        }
        if (type==='user.email') {
          if (value===undefined) {
            resultString = problem.git.getUserConfig({type:'email'})
            return
          }
          problem.git.setUserConfig({type:'email', email:value})
          return
        }
        resultString = `지원하지 않는 config입니다.
        git config user.name 'your name'
        git config user.email your@email.com
        을 현재 지원하고 있습니다.`
      },

      status(){
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        const status = problem.git.status()
        resultString = JSON.stringify(status, null, 4)
      },
    }
    
    subCommands[secondCommand](...restCommand)
  }else{
    resultString = '지원하지 않는 명령어입니다.'
  }
  return resultString

}

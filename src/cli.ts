import { Problem } from '@/problem/problem'
import { Git } from '@/git/git'
import { Directory } from './git/fileStructure'
import { PushRejectedError } from './git/gitTypes'

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
        // if (problem.git.getUserConfig({type:'email'}) === '') {
        //   resultString = `commit 작성자가 누군지 설정되어 있지 않습니다. 
        //   git config user.name 'your name'
        //   git config user.email your@email.com
        //   으로 먼저 설정한다음 commit하세요.`
        //   return
        // }
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

      remote(third?:string, remoteName?:string, remoteUrl?:string){
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        if (third === undefined || remoteName=== undefined || remoteUrl===undefined){
          resultString = `'$ git remote add origin 원격저장소주소'의 올바른 사용이 아닙니다.`
          return
        }
        if (third === 'add') {
          try{
            const remote = new Git(new Directory(remoteUrl))
            problem.git.addRemote(remoteName, remote)
          }catch{
            resultString =  `이미 이 저장소에 ${remoteName}이 존재하거나, ${remoteUrl} 주소가 잘못되었습니다.`
          }
        } else {
          resultString = '지원하지 않는 명령어 입니다.'
        }
      },

      push(remoteName?:string, branchName?:string) {
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        if (remoteName===undefined || branchName===undefined){
          resultString = `'$ git push origin master'처럼 올바르게 사용해주세요.`
          return
        }
        try {
          problem.git.push(remoteName, branchName)
          resultString = '어떻게 push 되었는지 알려드리고 싶지만, 아직은 마음만 있어요.'
        } catch (error) {
          if (error instanceof PushRejectedError) {
            resultString = `${remoteName}의 ${branchName}이 로컬 저장소보다 앞서 있어서 push할 수 없습니다.`
            return
          }else{
            resultString = `${remoteName}이나 ${branchName}이 잘못되었어요.`
            return
          }
        }
      },

      pull(remoteName?: string, branchName?: string) {
        if (!problem.git) {
          resultString = '현재 이 디렉토리는 git 저장소가 아닙니다.'
          return
        }
        if (remoteName===undefined || branchName===undefined){
          resultString = `'$ git pull origin master'처럼 올바르게 사용해주세요.`
          return
        }
        try {
          problem.git.pull(remoteName, branchName)
          // pull하다가 conflict 날 경우에는 추가로 commit 해야하는데, 그거는 일단 보류
          resultString = '어떻게 pull 되었는지 알려드리고 싶지만, 아직은 마음만 있어요.'
        } catch (error) {
          resultString = `${remoteName}이나 ${branchName}을 다시 확인해주세요.`
        }
      }
    }
    
    subCommands[secondCommand](...restCommand)
  }else{
    resultString = '지원하지 않는 명령어입니다.'
  }
  return resultString

}

import { Problem } from '@/problem'
import { ANSI_COLORS, ANSI_CONTROLS } from '@/terminal/gitTermANSI'
import { 
  commandSet, 
  commandformatterSet, 
  commandCandidatesTree,
} from '@/terminal/gitTermTypes'

export function isFormattingRequired(command: string []): boolean {
  let result = false
  const [firstCommand, secondCommand, ...restCommand] = command
  const commandSet: commandSet = {
    git: {
      status: true,
      commit: true,
    },
  }
  result = commandSet[firstCommand][secondCommand]
  return result
}

export function formattedDisplayMessage(problem: Problem, command: string [], message: string): string {
  let result = message
  const [firstCommand, secondCommand, ...restCommand] = command
  const commandformatterSet: commandformatterSet = {
    git: {
      status: function() {
        if (!problem.git) return message
        
        const parsedMessage = JSON.parse(message)
        const { deleted: deletedBeforeCommit, modified: modifiedBeforeCommit, unstaged } = parsedMessage.statusNotToCommit
        const { deleted: deletedAfterCommit, modified: modifiedAfterCommit, created } = parsedMessage.statusToCommit 
        
        let result = ''
        let hasChanged = false
        const head = problem?.git?.head
        result += `현재 브랜치 ${head} \n`
        result += '\n'

        if (created.length || deletedAfterCommit.length || modifiedAfterCommit.length) {
          let messageToCommit = '커밋할 변경 사항: \n'
          created.forEach((fileName: string) => {
            messageToCommit += highlight(`  새 파일: ${fileName}\n`, 'INFO')
          })
          deletedAfterCommit.forEach((fileName: string) => {
            messageToCommit += highlight(`  삭제함: ${fileName}\n`, 'INFO')
          })
          modifiedAfterCommit.forEach((fileName: string) => {
            messageToCommit += highlight(`  수정함: ${fileName}\n`, 'INFO')
          })
          hasChanged = true
          result += messageToCommit
          result += '\r\n'
        }
        
        if (deletedBeforeCommit.length || modifiedBeforeCommit.length) {
          let messageForNotStaged = '커밋하도록 정하지 않은 변경 사항: \n'
          modifiedBeforeCommit.forEach((fileName: string) => {
            messageForNotStaged += highlight(`  수정함: ${fileName}\n`, 'ERROR')
          })
          deletedBeforeCommit.forEach((fileName: string) => {
            messageForNotStaged += highlight(`  삭제함: ${fileName}\n`, 'ERROR')
          })
          hasChanged = true
          result += messageForNotStaged
          result += '\r\n'
        }
        
        if (unstaged.length) {
          let messageForUnstaged = '추적하지 않는 파일: \n'
          unstaged.forEach((fileName: string) => {
            messageForUnstaged += highlight(`  ${fileName}\n`, 'ERROR')
          })
          hasChanged = true 
          result += messageForUnstaged
          result += '\r\n'
        }
        
        
        
        if (!hasChanged) {
          result += '커밋할 변경 사항 없음, 작업 폴더 깨끗함'
        }

        return result.trimRight()
      },
      commit: function() {
        if (!problem.git) return message
        
        const { deleted: deletedBeforeCommit, modified: modifiedBeforeCommit, unstaged } = problem.git?.getStatusNotToCommit()
        const { deleted: deletedAfterCommit, modified: modifiedAfterCommit, created } = problem.git?.getStatusToCommit()
        
        if (message === 'there is no change' && (deletedBeforeCommit.length || modifiedBeforeCommit.length || unstaged.length)) {
          let result = ''
          let hasChanged = false
          const head = problem?.git?.head
          result += `현재 브랜치 ${head} \n`
          result += '\n'

          if (created.length || deletedAfterCommit.length || modifiedAfterCommit.length) {
            let messageToCommit = '커밋할 변경 사항: \n'
            created.forEach((fileName: string) => {
              messageToCommit += highlight(`  새 파일: ${fileName}\n`, 'INFO')
            })
            deletedAfterCommit.forEach((fileName: string) => {
              messageToCommit += highlight(`  삭제함: ${fileName}\n`, 'INFO')
            })
            modifiedAfterCommit.forEach((fileName: string) => {
              messageToCommit += highlight(`  수정함: ${fileName}\n`, 'INFO')
            })
            hasChanged = true
            result += messageToCommit
            result += '\r\n'
          }
          
          if (deletedBeforeCommit.length || modifiedBeforeCommit.length) {
            let messageForNotStaged = '커밋하도록 정하지 않은 변경 사항: \n'
            modifiedBeforeCommit.forEach((fileName: string) => {
              messageForNotStaged += highlight(`  수정함: ${fileName}\n`, 'ERROR')
            })
            deletedBeforeCommit.forEach((fileName: string) => {
              messageForNotStaged += highlight(`  삭제함: ${fileName}\n`, 'ERROR')
            })
            hasChanged = true
            result += messageForNotStaged
            result += '\r\n'
          }
          
          if (unstaged.length) {
            let messageForUnstaged = '추적하지 않는 파일: \n'
            unstaged.forEach((fileName: string) => {
              messageForUnstaged += highlight(`  ${fileName}\n`, 'ERROR')
            })
            hasChanged = true 
            result += messageForUnstaged
            result += '\r\n'
          }
          
          
          
          if (!hasChanged) {
            result += '커밋할 변경 사항 없음, 작업 폴더 깨끗함'
          }

          return result.trimRight()
        }

        return message
      }
    },
  }
  
  const handlerFunc = commandformatterSet[firstCommand][secondCommand]
  return handlerFunc ? handlerFunc() : result
}

export function highlight(data: string, logLevel: string): string {
  let result: string = ''
  const logColor = ANSI_COLORS[logLevel]
  const reset = ANSI_COLORS.RESET
  result = logColor + data + reset
  return result
}

export function splitCommand(data: string): string [] {
  const splitedCommand = data
  .replace(/ +(?= )/g, '')
  .trim()
  .match(/(?:[^\s']+|'[^']*')+/g) as string [] 
  return splitedCommand
}

export function findAutoCompleteCandidates(problem: Problem, command: string []): string [] {
  let result: string [] = []
  if (!command.length) return result

  const commandCandidatesTree: commandCandidatesTree = {
    git: {
      add: {},
      config: {},
      commit: {},
      status: {},
      init: {},
    }
  }

  const targetCommand = command[command.length - 1]
  let prev = commandCandidatesTree[command[0]]
  for (let i = 1; i < command.length - 1; i++) {
    prev = prev[command[i]]
  }
  if (!prev) return result

  const commandCandidates = Object.keys(prev).filter((key) => {
    if (key.includes(targetCommand)) return key
  })
  if (commandCandidates.length === 1) {
    if (commandCandidates[0] === targetCommand) {
      result = []
    } else {
      result = commandCandidates
    }
  }
  
  return result
}

export function findSimilarWord(command: string [], fileCandidates: string []): string {
  return ''
}
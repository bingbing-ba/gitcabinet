import { Problem } from '@/problem'
import { commandSet, commandformatterSet } from '@/terminal/gitTermTypes'
import { ANSI_COLORS, ANSI_CONTROLS } from '@/terminal/gitTermANSI'

export function isFormattingRequired(command: string []): boolean {
  let result = false
  const [firstCommand, secondCommand, ...restCommand] = command
  const commandSet: commandSet = {
    git: {
      status: true,
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
        
        if (deletedBeforeCommit.length || deletedAfterCommit.length) {
          let messageForDeleted = '커밋하도록 정하지 않은 변경 사항: \n'
          deletedBeforeCommit.forEach((fileName: string) => {
            messageForDeleted += highlight(`  삭제함: ${fileName}\n`, 'ERROR')
          })
          deletedAfterCommit.forEach((fileName: string) => {
            messageForDeleted += highlight(`  삭제함: ${fileName}\n`, 'ERROR')
          })
          hasChanged = true
          result += messageForDeleted
          result += '\r\n'
        }
        
        if (modifiedBeforeCommit.length || modifiedAfterCommit.length) {
          let messageForModified = '커밋하도록 정하지 않은 변경 사항: \n'
          modifiedBeforeCommit.forEach((fileName: string) => {
            messageForModified += highlight(`  수정함: ${fileName}\n`, 'ERROR')
          })
          modifiedAfterCommit.forEach((fileName: string) => {
            messageForModified += highlight(`  수정함: ${fileName}\n`, 'ERROR')
          })
          hasChanged = true
          result += messageForModified
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
        
        if (created.length || deletedAfterCommit.length) {
          let messageToCommit = '커밋할 변경 사항: \n'
          created.forEach((fileName: string) => {
            messageToCommit += highlight(`  새 파일: ${fileName}\n`, 'INFO')
          })
          deletedAfterCommit.forEach((fileName: string) => {
            messageToCommit += highlight(`  삭제함: ${fileName}\n`, 'INFO')
          })
          hasChanged = true
          result += messageToCommit
          result += '\r\n'
        }
        
        if (!hasChanged) {
          result += '커밋할 변경 사항 없음, 작업 폴더 깨끗함'
        }

        return result.trimRight()
      },
    },
  }
  
  const handlerFunc = commandformatterSet[firstCommand][secondCommand]
  return handlerFunc ? handlerFunc() : result
}

export default function highlight(data:string, logLevel: string): string {
  let result: string = ''
  const logColor = ANSI_COLORS[logLevel]
  const reset = ANSI_COLORS.RESET
  result = logColor + data + reset
  return result
}
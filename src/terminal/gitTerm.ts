import { Terminal, IDisposable } from 'xterm'
import { cli } from '@/cli'
import { Problem } from '@/problem'
import { PlainFile } from "@/git/fileStructure"
import { Prompt } from '@/terminal/gitTermTypes'
import { ANSI_COLORS, ANSI_CONTROLS } from '@/terminal/gitTermANSI'
import { isFormattingRequired, formattedDisplayMessage, splitCommand } from '@/terminal/gitTermUtils'
import { words } from 'lodash'

export class gitTerm {
  term: Terminal
  problem: Problem
  _history: Array<string>
  _cursor: number
  _input: string
  _isTermCommand: boolean
  _prompt: Prompt
  
  constructor(term: Terminal, problem: Problem) {
    this.term = term
    this.problem = problem
    this._history = []
    this._cursor = 0
    this._input = ''
    this._isTermCommand = false
    this._prompt = {
      directory: '~',
      promptType: '$',
      head: this.problem.git?.head || '',
      hasFileChanges: false,
    }
    this.setPrompt()
  }
  
  private _disposables: IDisposable[] = []
  
  activate(terminal: Terminal): void {
    this._disposables.push(terminal.onData(this.handleData.bind(this)))
  }
  
  dispose(): void {
    this._disposables.forEach(d => d.dispose())
    this._disposables.length = 0
  }

  setPrompt(): void {
    const { directory, promptType, head } = this._prompt
    const spaces = ' ' // 2 spaces as default
    const prefix = `${ANSI_COLORS.CYAN}${directory}${promptType}${ANSI_COLORS.RESET}`
    const suffix = `${ANSI_COLORS.YELLOW}(${head})${ANSI_COLORS.RESET}`
    
    let result: string = ''
    if (head) {
      result = prefix + spaces + suffix + spaces
    } else {
      result = prefix + spaces
    }
    this.term.write(result)
  }
  
  setHead(): void {
    this._prompt.head = this.problem.git?.head || ''
  }
  
  handleData(data: string): void {
    const ord: number = data.charCodeAt(0)
    const keyPressed: string = data.substring(1)
    
    // handle ANSI data such as Arrow keys (refer to ASCII codes)
    if (ord === 0x1b) {
      switch (keyPressed) {
        case '[A': { // up arrow 
          if (this._history.length) {}
          else return
          break
        }
        case '[B': { // down arrow
          if (this._history.length) {}
          else return
          break
        }
        case '[D': { //
          break
        }
        case '[C': {
          break
        }
      }
      
      // handle special characters such as Enter & Backspace
    } else if (ord < 32 || ord === 0x7f) {
      switch (data) {
        case '\r': { // enter
          if (this.isInputIncomplete(this._input)) {
            // pass
          } else {
            this.handleCompleteInput(this._input)
          }
          break
        }
        case '\x7f': { // backspace
          this.handleErase()
          break
        }
        case '\t': { // tab
          
          // 1. 입력 명령어 파악 => 스플릿해서 파싱
          const splittedCommand = splitCommand(this._input)

          // 2. 커서 위치 파악
          //    - git add_일 경우 break
          //    - git add _일 경우 next
          let wordsLength = 0
          splittedCommand.forEach((word, idx) => {
            if (idx !== splitCommand.length - 1) wordsLength += 1
            wordsLength += word.length
          })
          if (wordsLength === this._cursor) return

          // 2. 명령어 입력 위치에서 추천 가능한 후보군 찾기
          //    - 후보군은 trie 형태로 저장
          //    - ex) gi_일 때는 git 추천
          //    - ex) git ad_일 때는 add 추천
          


          // 3. 후보군 추천

          const dirChildren = this.problem.refDirectory.getChildrenName()
          break
        }
      }
    } else {
      this.setInput(data)
    }
  }

  clearTerm(): void {
    this.term.clear()
    this.term.write('\x1b[2K\r')
    // this.term.write('\x1B[F\x1B[K')
    // this._cursor = 0
    // this._input = ''
  }
  
  setInput(data: string): void {
    this._input += data
    this._cursor += 1
    this.term.write(data)
  }
  
  setProblem(problem: Problem): void {
    if (this.problem === problem) return
    
    this.setHead()
    this.setPrompt()
    this.clearTerm()
    this.problem = problem
  }
  
  isInputIncomplete(data: string): any {
    if (data.trim() === '') {
      return false
    }
  }
  
  handleCompleteInput(data: string): void {
    
    let displayMessage: string = ''
    
    if (data.length) {
      displayMessage = this.handleCommand(data)
    }
    
    if (!this._isTermCommand) {
      displayMessage = '\r\n' + displayMessage + '\r\n'
    }
    if (!this._isTermCommand && !displayMessage.trim()) {
      displayMessage = '\r\n'
    }
    
    this._history.push(data)
    this.setInput(displayMessage)
    this.setHead()
    this.setPrompt()
    this._cursor = 0
    this._input = ''
    this._isTermCommand = false
  }
  
  handleErase(): any {
    if (this._cursor <= 0) return
    const prefix = this._input.substring(0, this._cursor - 1)
    const suffix = this._input.substring(this._cursor)
    this._input = prefix + suffix
    this.term.write('\x1b[2K\r')
    this.setPrompt()
    this.term.write(this._input)
    this._cursor -= 1
  }
  
  handleCommand(data: string): string {
    const splittedCommand = splitCommand(data)
    
    // 터미널 명령어일 경우 처리 후 리턴
    if (this.handleTermCommand(splittedCommand)) {
      this._isTermCommand = true
      return ''
    } 
    
    // git 관련 명령어 처리
    let result = ''
    try {
      result = cli(data, this.problem) // try-catch needed
      if (isFormattingRequired(splittedCommand)) {
        result = formattedDisplayMessage(this.problem, splittedCommand, result)
      }
    } catch {
      result = '지원하지 않는 명령어입니다.'
    }
    
    return result
  }
  
  handleTermCommand(command: string []): boolean {
    if (!command.length) return false
    const [firstCommand, secondCommand, ...restCommand] = command
    
    if (firstCommand && !secondCommand) {
      switch (firstCommand) {
        case 'clear': {
          this.clearTerm()
          this._isTermCommand = true
          return true
        }
        case 'ls': {
          const fileNames = this.problem.refDirectory.getChildrenName()
          const result = fileNames.join(' ')
          if (result) {
            this.term.write('\r\n')
            this.setInput(result)
          }
          this.term.write('\r\n')
          this._isTermCommand = true
          return true
        }
      }
    } else {
      switch (firstCommand) {
        case 'touch': {
          new PlainFile(secondCommand, this.problem.refDirectory)
          restCommand.forEach((fileName) => {
            new PlainFile(fileName, this.problem.refDirectory)
          })
          this.term.write('\r\n')
          this._isTermCommand = true
          return true
        }
        case 'mkdir': {
          // TBD
          this.term.write('\r\n')
          this._isTermCommand = true
          return true
        }
        case 'rm': {
          // TBD
          this.term.write('\r\n')
          this._isTermCommand = true
          return true
        }
      }
    }
    return false
  }
}

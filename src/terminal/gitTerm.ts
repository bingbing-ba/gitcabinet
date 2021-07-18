import { Terminal, IDisposable } from 'xterm'
import { cli } from '@/cli'
import { Problem } from '@/problem'
import { PlainFile } from "@/git/fileStructure"
import { Prompt } from '@/terminal/gitTermTypes'
import { ANSI_COLORS, ANSI_CONTROLS } from '@/terminal/gitTermANSI'
import { 
  isFormattingRequired, 
  formattedDisplayMessage, 
  splitCommand,
  findAutoCompleteCandidates,
  findFileCandidates,
} from '@/terminal/gitTermUtils'

export class gitTerm {
  term: Terminal
  problem: Problem
  _history: Array<string>
  _cursor: number
  _row: number
  _tabIndex: number
  _input: string
  _isTermCommand: boolean
  _prompt: Prompt
  
  constructor(term: Terminal, problem: Problem) {
    this.term = term
    this.problem = problem
    this._history = []
    this._cursor = 0
    this._row = 0
    this._tabIndex = 0
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
          if (!this._input.length) break          
          const splittedCommand = splitCommand(this._input)

          let wordsLength = 0
          splittedCommand.forEach((word, idx) => {
            if (idx !== splitCommand.length - 1) wordsLength += 1
            wordsLength += word.length
          })

          const commandCandidates = findAutoCompleteCandidates(this.problem, splittedCommand)

          if (!commandCandidates.length) {
            const fileTempCandidates = this.problem.refDirectory.getChildrenName()
            const fileCandidates = findFileCandidates(splittedCommand, fileTempCandidates)
            
            // if the candiate's length is one, auto complete it 
            if (fileCandidates.length == 1) {
              const compensatedArgLength = fileCandidates[0].length - splittedCommand[splittedCommand.length - 1].length
              this._cursor += compensatedArgLength
              this.term.write('\x1b[2K\r')
              this.setPrompt()
              const prefix = splittedCommand.slice(0, splittedCommand.length-1)
              const suffix = fileCandidates[0]
              const newCommand = [...prefix, suffix]
              this._input = newCommand.join(' ')
              this.term.write(this._input)  
              // if not, show the list below the current line
              // WORK FROM HERE (0625)
            } else if (fileCandidates.length > 1) {
              if (this._tabIndex % fileCandidates.length >= 0) {
                const fileToAutoComplete = fileCandidates[this._tabIndex]
                this.term.write('\x1b[2K\r')
                this.setPrompt()
                this.term.write(this._input + fileToAutoComplete.toString() + '\n' + fileCandidates.toString())
                const cursorPos = ANSI_CONTROLS.setCursorPosition(this._row, this.term.rows + this._input.length + fileToAutoComplete.toString().length + 1)
                this.term.write(cursorPos)
              } else {
                this.term.write('\x1b[2K\r')
                this.setPrompt()
                this.term.write(this._input + '\n' + fileCandidates.toString())
                const cursorPos = ANSI_CONTROLS.setCursorPosition(this._row, this.term.rows + this._input.length + 1)
                this.term.write(cursorPos)
              }
              this._tabIndex = (this._tabIndex + 1) % fileCandidates.length
            }

            if (!fileCandidates.length && wordsLength === this._cursor) {
              this.setInput(' ')
              return 
            }
          } else {
            const compensatedArgLength = commandCandidates[0].length - splittedCommand[splittedCommand.length - 1].length
            this._cursor += compensatedArgLength
            this.term.write('\x1b[2K\r')
            this.setPrompt()
            const prefix = splittedCommand.slice(0, splittedCommand.length-1)
            const suffix = commandCandidates[0]
            const newCommand = [...prefix, suffix]
            this._input = newCommand.join(' ')
            this.term.write(this._input)          
          }
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
    this._cursor = 0
    this._input = ''
  }
  
  setInput(data: string): void {
    this._input += data
    this._cursor += 1
    this.term.write(data)
  }
  
  setProblem(problem: Problem): void {
    if (this.problem === problem) return
    
    this.clearTerm()
    this.problem = problem
    this.setHead()
    this.setPrompt()
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
    this._row += 1
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

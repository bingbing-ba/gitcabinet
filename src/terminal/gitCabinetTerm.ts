import { Terminal, IDisposable } from 'xterm'
import { Problem } from '@/problem'
import { cli } from '@/cli'
import { PlainFile } from "@/git/fileStructure"

// https://github.com/qwefgh90/ng-terminal/blob/master/projects/ng-terminal/src/lib/functions-using-csi.ts
interface ANSI_COLORS {
  PLAIN: string,
  ERROR: string,
  YELLOW: string,
  CYAN: string,
  INFO: string,
  RESET: string,
}
interface ANSI_CONTROLS {
  CURSOR_BACKWORD: string,
  CURSOR_FORWARD: string,
}

const ANSI_COLORS: ANSI_COLORS = {
  PLAIN: '\u001b[37m',
  ERROR: '\u001b[31;1m',
  YELLOW: '\u001b[33;1m',
  CYAN: '\u001b[36;1m',
  INFO: '\u001b[32;1m',
  RESET: '\u001b[0m',
}
const ANSI_CONTROLS = {
  CURSOR_BACKWORD: '\x9b1D', // CSI Ps D
  CURSOR_FORWARD: '\x9b1C',  // CSI Ps C
}

interface Prompt {
  directory: string,
  promptType: string,
  head: string,
  hasFileChanges: boolean,
}

export class gitCabinetTerm {
  term: Terminal
  problem: Problem
  _history: Array<Object>
  _cursor: number
  _scrollHeight: number
  _input: string
  _isTermCommand: boolean
  _prompt: Prompt
  
  constructor(term: Terminal, problem: Problem) {
    this.term = term
    this.problem = problem
    this._history = []
    this._cursor = 0
    this._scrollHeight = 0
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
        case '[A': {
          if (this._history.length) {}
          else return
          break
        }
        case '[B': {
          if (this._history.length) {}
          else return
          break
        }
        case '[D': {
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
    
    this.setInput(displayMessage)
    this.setPrompt()
    this._cursor = 0
    this._scrollHeight += 1
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
    if (this.handleTermCommand(data)) {
      this._isTermCommand = true
      return ''
    }

    let displayMessage = ''
    try {
      displayMessage = cli(data, this.problem) // try-catch needed
    } catch {
      displayMessage = '지원하지 않는 명령어입니다.'
    }
    
    let result: string = ''
    const isCorrect = this.problem.isCorrect()

    if (!displayMessage.trim()) return result
    if (isCorrect) {
      result = this.highlight(displayMessage, 'INFO')
    } else {
      result = this.highlight(displayMessage, 'ERROR')
    }
    
    return result
  }
  
  handleTermCommand(command: string): boolean {
    const splitedCommand = command
      .replace(/ +(?= )/g, '')
      .trim()
      .match(/(?:[^\s']+|'[^']*')+/g) as string [] 
    const [firstCommand, secondCommand, ...restCommand] = splitedCommand
    
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
  
  highlight(data:string, logLevel: string): string {
    let result: string = ''
    const logColor = ANSI_COLORS[logLevel as keyof ANSI_COLORS]
    const reset = ANSI_COLORS.RESET
    result = logColor + data + reset
    return result
  }
}

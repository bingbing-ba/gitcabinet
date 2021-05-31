import { Terminal, IDisposable } from 'xterm'
import { Problem } from '@/problem'
import { cli } from '@/cli'

// https://github.com/qwefgh90/ng-terminal/blob/master/projects/ng-terminal/src/lib/functions-using-csi.ts
interface ANSI_COLORS {
  PLAIN: string,
  ERROR: string,
  INFO: string,
  RESET: string,
}

const ANSI_COLORS: ANSI_COLORS = {
  PLAIN: '\u001b[37m',
  ERROR: '\u001b[31;1m',
  INFO: '\u001b[32;1m',
  RESET: '\u001b[0m',
}
const ANSI_CONTROLS = {
  cursorBackward: '\x9b1D', // CSI Ps D
  cursorForward: '\x9b1C',  // CSI Ps C
}

interface Prompt {
  directory: string,
  promptType: string,
  gitBranch: string,
  hasFileChanges: boolean,
}

export class gitCabinetTerm {
  term: Terminal
  problem: Problem
  _history: Array<Object>
  _cursor: number
  _input: string
  _prompt: Prompt
  _isTermCommand: boolean
  
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
      gitBranch: '',
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

  setPrompt() {
    const { directory, promptType, gitBranch } = this._prompt
    const spaces = ' '
    const result = directory + promptType + gitBranch + spaces
    this.term.write(result)
  }
  
  handleData(data: string): void {
    const ord = data.charCodeAt(0)
    const keyPressed = data.substring(1)
    
    // handle ANSI data such as Arrow keys (refer to ASCII codes)
    if (ord === 0x1b) {
      switch (keyPressed) {
        case '[A': // ArrowUp
          if (this._history.length) {}
          else return
          break
        case '[B': // ArrowDown
          if (this._history.length) {}
          else return
          break
        case '[D': // ArrowLeft
          break
        case '[C': // ArrowRight
          break
      }
      
      // handle special characters such as Enter & Backspace
    } else if (ord < 32 || ord === 0x7f) {
      switch (data) {
        case '\r': // Enter
          if (this.isInputIncomplete(this._input)) {
            // pass
          } else {
            this.handleCompleteInput(this._input)
          }
        case '\x7f': // backspace
          this.handleErase()
      }
    } else {
      this.setInput(data)
    }
  }
  
  setInput(data: string) {
    this._input += data
    this._cursor += 1
    this.term.write(data)
  }
  
  isInputIncomplete(data: string) {
    if (!data.trim()) {
      return false
    }
  }
  
  handleCompleteInput(data: string) {
    let displayMessage = ''

    if (data.length) {
      displayMessage = this.handleCommand(data)
    }
    
    if (!this._isTermCommand) {
      displayMessage = '\r\n' + displayMessage + '\r\n'
    }
    
    this.setInput(displayMessage)
    this.setPrompt()
    this._cursor = 0
    this._input = ''
    this._isTermCommand = false
  }
  
  handleErase(): any {
    if (this._cursor <= 0) return
    this._input = this._input.substring(0, this._cursor - 1) + this._input.substring(this._cursor)
    this._cursor -= 1
    this.term.write('\b \b')
  }
  
  handleCommand(data: string): string {
    if (this.handleTermCommand(data)) {
      this._isTermCommand = true
      return ''
    }
    const displayMessage = cli(data, this.problem)
    const isCorrect = this.problem.isCorrect()
    
    let result = ''
    if (isCorrect) {
      result = this.highlight(displayMessage, 'INFO')
    } else {
      result = this.highlight(displayMessage, 'ERROR')
    }
    
    return result
  }

  handleTermCommand(command: string): boolean {
    switch (command) {
      case 'clear':
        this.term.clear()
        this.term.write('\x1b[2K\r')
        this._cursor = 0
        this._input = ''
        this._isTermCommand = true
        return true
      case 'ls':
        const fileNames = this.problem.refDirectory.getChildrenName()
        this.term.write('\n')
        this.setInput(fileNames.toString())
        this.term.write('\n')
        this._isTermCommand = true
        return true
    }
    return false
  }

  highlight(data:string, level: string): string {
    let result = ''
    const logColor = ANSI_COLORS[level as keyof ANSI_COLORS]
    const reset = ANSI_COLORS.RESET

    result = logColor + data + reset
    return result
  }
}

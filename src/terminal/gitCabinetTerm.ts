import { Terminal, IDisposable } from 'xterm';

// https://github.com/qwefgh90/ng-terminal/blob/master/projects/ng-terminal/src/lib/functions-using-csi.ts
const ANSI_COLORS = {
  RED: '\u001b[31;1m',
  GREEN: '\u001b[32;1m',
  RESET: '\u001b[0m',
}
const ANSI_CONTROLS = {
  cursorBackward: '\x9b1D', // CSI Ps D
  cursorForward: '\x9b1C',  // CSI Ps C
}

export class gitCabinetTerm {
  _history: Array<Object>
  _cursor: Number
  _input: String
  _prompt: Object
  
  constructor() {
    this._history = []
    this._cursor = 0
    this._input = ''
    this._prompt = {}
  }
  
  private _disposables: IDisposable[] = []
  
  activate(terminal: Terminal): void {
    this._disposables.push(terminal.onData(this.handleData))
  }
  
  dispose(): void {
    this._disposables.forEach(d => d.dispose())
    this._disposables.length = 0
  }
  
  handleData(data: String): void {
    const ord = data.charCodeAt(0)
    const keyPressed = data.substring(1)
    
    // handle ANSI data
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
      
      // handle special characters (refer to ASCII codes)
    } else if (ord < 32 || ord === 0x7f) {
      
    } else {
    }
  }
}
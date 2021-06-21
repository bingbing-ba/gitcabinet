import { ANSI_COLORS as ANSI_COLORS_TYPE } from '@/terminal/gitTermTypes'

// https://github.com/qwefgh90/ng-terminal/blob/master/projects/ng-terminal/src/lib/functions-using-csi.ts

export const ANSI_COLORS: ANSI_COLORS_TYPE = {
  PLAIN: '\u001b[37m',
  ERROR: '\u001b[31;1m',
  YELLOW: '\u001b[33;1m',
  CYAN: '\u001b[36;1m',
  INFO: '\u001b[32;1m',
  RESET: '\u001b[0m',
}

export const ANSI_CONTROLS = {
  CURSOR_BACKWORD: '\x9b1D', // CSI Ps D
  CURSOR_FORWARD: '\x9b1C',  // CSI Ps C
  CURSOR_UP: '\x9b1A',
  setCursorPosition: function(row: number, col: number): string {
    return `\x9b${row};${col}H`
  },
}
export interface Prompt {
  directory: string,
  promptType: string,
  head: string,
  hasFileChanges: boolean,
}
export interface ANSI_COLORS {
  [key: string]: string,
  PLAIN: string,
  ERROR: string,
  YELLOW: string,
  CYAN: string,
  INFO: string,
  RESET: string,
}

export interface ANSI_CONTROLS {
  [key: string]: string,
  CURSOR_BACKWORD: string,
  CURSOR_FORWARD: string,
}

export const ANSI_COLORS: ANSI_COLORS = {
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
}

export interface commandSet {
  [key: string]: {
    [key: string]: boolean,
  }
}

export interface commandformatterSet {
  [key: string]: {
    [key: string]: Function,
  }
}

export interface commandCandidatesTree {
  [key: string]: {
    [key: string]: {},
  }
}
<template>
  <div id="terminal">
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { Problem } from '@/problems/problem'
import { gitCabinetTerm } from '@/terminal/gitCabinetTerm'
import { Terminal } from 'xterm'
import 'xterm/lib/xterm.js'
import 'xterm/css/xterm.css'

export default defineComponent({
  props: {
    problem: {
      type: Problem,
      required: true,
    },
  },
  setup(props, { emit }) {
      onMounted(() => {
        const termOptions = {
          theme: {
            foreground: 'white',
            background: '#0F172A',
          },
          lineHeight: 1.5,
          fontSize: 18,
          scrollSensitivity: 50,
          minimumContrastRatio: 4.5,
          convertEol: true,
          cursorBlink: true,
        }
      const term = new Terminal(termOptions)
      term.loadAddon(new gitCabinetTerm())
      term.open(document.querySelector('#terminal') as HTMLElement)
      term.focus()
    })
    
    // const problem = props.problem
    // let terminal = {}
      
    //   const CURSOR_START_POSITION = 3
    //   let curPosition = CURSOR_START_POSITION
    //   let curLine = 0
    //   let inputCommand = ''
    //   let workingDir = '~'
    //   term.write(`${workingDir}$ `)
      
    //   let solved = false
    //   term.onKey((e) => {
    //     const key = e.domEvent.key
    //     if (key === 'ArrowDown' || key === 'ArrowUp') {
    //       // a handler for the comamnd history
    //       return
    //     }

    //     if (key === 'ArrowLeft') {
    //       if (curPosition === CURSOR_START_POSITION) return
    //       curPosition -= 1
    //       term.write(ANSI_CONTROLS.cursorBackward)
    //       return
    //     }
        
    //     if (key === 'ArrowRight') {  
    //       if (curPosition === inputCommand.length + CURSOR_START_POSITION) return
    //       curPosition += 1
    //       term.write(ANSI_CONTROLS.cursorForward)
    //       return
    //     }

    //     if (key === 'Backspace') {
    //       if (curPosition === 3) return
    //       curPosition -= 1
    //       term.write('\b \b')
    //       return
    //     }
        
    //     if (key === 'Enter') {
    //       inputCommand = inputCommand
    //       console.log(inputCommand)

    //       if (inputCommand === 'clear') {
    //         term.reset()
    //         term.clear()
    //         term.write('\x1b[2K\r')
    //         term.write(`${workingDir}$ `)
    //         inputCommand = ''
    //         curPosition = CURSOR_START_POSITION
    //         return
    //       }
          
    //       if (inputCommand && curLine < 6) {
    //         // issue: secondCommand가 정의되지 않은 메서드일 경우 'apply of undefined' 에러
    //         // ex) git init test (OK) => git niit test (ERROR!)
    //         let message = ''
    //         try {
    //           message = cli(inputCommand, problem)
    //         } catch {
    //           message = '지원하지 않는 명령어입니다.'
    //         }
    //         const result = problem.isCorrect()
    //         let logLevel = ''
            
    //         if (solved) {
    //           logLevel = ANSI_COLORS.RED
    //         } else {
    //           logLevel = result ? ANSI_COLORS.GREEN : ANSI_COLORS.RED
    //           solved = result
    //         }

    //         const promptMessage = logLevel + message + ANSI_COLORS.RESET
    //         term.write('\r\n')
    //         term.write(promptMessage)
    //       }
          
    //       if (curLine >= 6) {
    //         term.reset()
    //         term.clear()
    //         term.write('\x1b[2K\r')
    //         term.write(`${workingDir}$ `)
    //         inputCommand = ''
    //         curLine = 0
    //         return
    //       }
          
    //       inputCommand = ''
    //       curPosition = CURSOR_START_POSITION
    //       curLine += 1
    //       term.write('\r\n')
    //       term.write(`${workingDir}$ `)
    //       return
    //     }

    //     inputCommand += e.key
    //     curPosition += 1
    //     term.write(e.key)
    //   })
    //   term.onLineFeed(() => {
    //     term.scrollToLine(5)
    //   })

    //   return term
    // }
  },
})
</script>

<style>
#terminal {
  @apply bg-gray-900 rounded overflow-scroll;
}

#terminal::-webkit-scrollbar {
  @apply bg-gray-900 rounded;
}

#terminal::-webkit-scrollbar-corner {
  @apply bg-gray-900 rounded;
}

#terminal::-webkit-scrollbar-corner {
  @apply bg-gray-900 rounded;
}

#terminal::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded w-3 mt-3;
}

.xterm {
  padding: 10px;
}

.xterm, .xterm-viewport {
  height: 0 !important;
  width: 0 !important;
}

.xterm-viewport {
  overflow-y: scroll;
}
</style>

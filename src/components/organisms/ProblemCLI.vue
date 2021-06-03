<template>
  <div id="terminal">
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, watch } from 'vue'
import { Problem } from '@/problem'
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
    const problem = props.problem
    
    let term: Terminal
    let cabinetTerm: any
    onMounted(() => {
      const termOptions = {
        theme: {
          foreground: 'white',
          background: '#0F172A',
        },
        lineHeight: 1.5,
        fontSize: 16,
        scrollSensitivity: 50,
        minimumContrastRatio: 4.5,
        convertEol: true,
        cursorBlink: true,
      }
      term = new Terminal(termOptions)
      term.open(document.querySelector('#terminal') as HTMLElement)
      cabinetTerm = new gitCabinetTerm(term, problem)
      term.loadAddon(cabinetTerm)
      term.focus()
    })

    onUpdated(() => {
      cabinetTerm.setProblem(props.problem)
      term.focus()
    })
    
    watch(problem, (newProblem, oldProblem) => {
      cabinetTerm.setProblem(newProblem)
      term.focus()
    })
  },
})
</script>

<style>
#terminal {
  @apply bg-gray-900 rounded overflow-y-scroll overflow-x-hidden break-words min-w-full max-w-full;
}

#terminal::-webkit-scrollbar {
  @apply bg-gray-900 w-3 h-3 rounded;
}

#terminal::-webkit-scrollbar-track {
  @apply bg-gray-900 w-3 rounded;
}

#terminal::-webkit-scrollbar-corner {
  @apply bg-gray-900 w-3 rounded;
}

#terminal::-webkit-scrollbar-corner {
  @apply bg-gray-900 w-3 rounded;
}

#terminal::-webkit-scrollbar-thumb {
  @apply bg-gray-500 w-3 rounded w-3 mt-3;
}

.xterm {
  padding: 10px;
}

.xterm, .xterm-viewport {
  height: 0 !important;
  width: 0 !important;
}

.xterm-screen {
  max-width: 100% !important;
  width: 0 !important;
}

.xterm-viewport {
  overflow-y: scroll;
}
</style>

<template>
  <div id="terminal"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, watch, watchEffect } from 'vue'
import { Problem } from '@/problem'
import { gitTerm } from '@/terminal/gitTerm'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/lib/xterm.js'
import 'xterm/css/xterm.css'

export default defineComponent({
  props: {
    problem: {
      type: Problem,
      required: true,
    },
    hasReset: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
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
      term.attachCustomKeyEventHandler(function(e){
        if (e.ctrlKey && (e.key === 'v')) {
          document.execCommand('paste')
          return false
        }
        return true
      })
      term.open(document.querySelector('#terminal') as HTMLElement)
      const fitAddon = new FitAddon()
      cabinetTerm = new gitTerm(term, props.problem)
      term.loadAddon(fitAddon)
      term.loadAddon(cabinetTerm)
      term.focus()
      fitAddon.fit()
    })

    onUpdated(() => {
      cabinetTerm.setProblem(props.problem)
      if (props.hasReset) {
        cabinetTerm.clearTerm()
        cabinetTerm.setPrompt()
        emit('undo-reset')
      }
    })

    watch(props.problem, (newProblem) => {
      cabinetTerm.setProblem(newProblem)
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

.xterm .xterm-viewport {
  overflow: hidden;
}

.xterm {
  padding: 10px;
}
</style>

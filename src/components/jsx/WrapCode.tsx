import { defineComponent, computed, ref } from 'vue'
import { Badge, IconClipBoard } from '..'

const WrapCode = defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const text = computed(() => props.text)

    const replaceNewline = (s: string) => {
      if (s.includes('\n')) {
        const splited = s.split('\n')
        return splited.map((x, idx) => {
          if (idx === splited.length - 1) {
            return <>{x}</>
          }
          return (
            <>
              {x}
              <br />
            </>
          )
        })
      }
      return <>{s}</>
    }

    // 나중을 위해서, 지금은 alert로 했지만 나중에는 아이콘이 변하든 copied! 태그가 떴다가 사라지든
    const copied = ref(false)

    const copyText = (s: string) => {
      const textarea = (window as any).document.createElement('textarea')
      textarea.value = s
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 1000)
      alert('복사되었어요!')
    }

    const result = computed(() => {
      return text.value.split('*').map((splited) => {
        if (splited.startsWith('$')) {
          return <code class="problem__content-code">{splited}</code>
        }
        if (splited.startsWith('^')) {
          splited = splited.replace('^', '')
          return (
            <span class="problem__content-strong" style={{ cursor: 'pointer' }} onClick={() => copyText(splited)}>
              {splited}
              <IconClipBoard />
            </span>
          )
        }
        if (splited.startsWith('#')) {
          splited = splited.replace('#', '')
          return <span class="problem__content-strong">{splited}</span>
        }
        return replaceNewline(splited)
      })
    })

    return () => <p>{...result.value}</p>
  },
})

export default WrapCode

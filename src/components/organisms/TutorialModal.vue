<template>
  <div v-if="tutorialOpend" class="modal-background" @click="closeTutorial">
    <div class="modal-content flex flex-col">
      <Title>튜토리얼</Title>
      <div class="flex flex-col justify-center items-center">
        <img :src="image" />
        <div class="mt-4">{{ description }}</div>
      </div>
      <div class="flex justify-center mt-8 dots">
        <div v-for="(_, index) in images" :key="index">
          <div :class="{ active: index === step, dot: true }" @click="toStep(index)"></div>
        </div>
      </div>
      <div class="tutorial-btn prev" @click="toStep(step - 1)"><IconArrowLeft /></div>
      <div class="tutorial-btn next" @click="toStep(step + 1)"><IconArrowRight /></div>
      <div class="flex justify-end mt-8 items-center">
        <input type="checkbox" id="never-tutorial" v-model="neverTutorial" />
        <label for="never-tutorial" class="cursor-pointer">다시보지않기</label>
        <Button @click="closeTutorial" class="ml-4">튜토리얼 닫기</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// customer service modal
import { defineComponent, ref, computed, watch } from 'vue'
import { Title, IconArrowLeft, IconArrowRight, Button } from '@/components'
import problem_index from '@/assets/problem_index.png'
import problem_cli from '@/assets/problem_cli.png'
import directory from '@/assets/directory.png'
import menubar from '@/assets/menubar.png'

export default defineComponent({
  components: { Title, IconArrowLeft, IconArrowRight, Button },
  setup(_, { emit }) {
    const neverTutorial = ref(false)
    watch(neverTutorial, () => {
      localStorage.setItem('never-tutorial', String(neverTutorial.value))
    })

    const tutorialOpend = ref(localStorage.getItem('never-tutorial') === 'true' ? false : true)
    console.log({ tutorialOpend })
    const step = ref(0)

    const images = [problem_cli, problem_index, menubar, directory]
    const descriptions = [
      '문제를 읽고 아래 터미널에서 명령어를 입력하여 문제를 해결해보세요. 그리고 오른쪽화면에서 어떤 변화가 일어나는지 확인하세요.',
      '맞춘 문제는 초록색으로 표시됩니다. 문제를 다시 풀고 싶다면 옆의 리셋 버튼을 클릭하세요.',
      '기본적으로 각 문제에 맞는 뷰가 설정되어 있습니다. 따로 원하는 뷰가 있다면 클릭해서 확인할 수 있습니다.',
      '디렉토리에서 파일의 내용을 확인하거나 수정할 수 있습니다.',
    ]
    const image = computed(() => {
      return images[step.value]
    })
    const description = computed(() => {
      return descriptions[step.value]
    })

    const toStep = (to: number) => {
      if (to >= 0 && to < images.length) {
        step.value = to
      }
    }

    const closeTutorial = (e: Event) => {
      e.stopPropagation()
      const target = e.target as HTMLElement
      if (target.textContent === '튜토리얼 닫기' || target.classList.contains('modal-background')) {
        tutorialOpend.value = false
      }
    }
    return {
      tutorialOpend,
      closeTutorial,
      image,
      images,
      toStep,
      step,
      description,
      neverTutorial,
    }
  },
})
</script>

<style scoped>
.modal-background {
  position: fixed;
  margin: auto;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  @apply bg-gray-400 bg-opacity-50;
}

.modal-content {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 42rem;
  max-width: 40vw;
  height: fit-content;
  background-color: #fff;
  padding: 2rem 4rem;
  border-radius: 16px;
  box-shadow: 0 0 4px 1px #aaa;
}

.dots > *:not(:first-child) {
  margin-left: 1rem;
}

.dot {
  width: 1rem;
  cursor: pointer;
  height: 1rem;
  border-radius: 50%;
  @apply bg-gray-300;
}

.dot.active {
  @apply bg-gray-900;
}

.tutorial-btn {
  position: absolute;
  width: 2rem;
  height: 100%;
  top: 0;
  cursor: pointer;
}
.tutorial-btn:hover {
  @apply bg-gray-200;
}
.tutorial-btn > * {
  width: 100%;
  height: 100%;
}
.tutorial-btn.prev {
  left: 0;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
.tutorial-btn.next {
  right: 0;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}
</style>

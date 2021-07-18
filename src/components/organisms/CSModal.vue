<template>
  <div v-if="modalOpened" class="modal-background" @click="closeModal">
    <div class="modal-content">
      <Title>GIT CABINET</Title>
      <p>아래와 같은 문의사항이 있다면 알려주세요!</p>
      <ul>
        <li>git에 대해 알고 싶은 개념</li>
        <li>GIT CABINET의 버그</li>
        <li>GIT CABINET의 개선점</li>
      </ul>
      <textarea rows="5" placeholder="문의사항을 남겨주세요" v-model="comments"></textarea>
      <div class="button-group">
        <button @click="leaveComments">문의 남기기</button>
        <button @click="closeModal">닫기</button>
      </div>
      <div class="repository">
        <div>개발한 곳 <a href="https://github.com/bingbing-ba/gitcabinet" target="_blank">@github</a></div>
      </div>
    </div>
    <div class="loading-box" :class="{ 'loading-active': isLoading }">접수중...</div>
  </div>
</template>

<script lang="ts">
// customer service modal
import { defineComponent, ref } from 'vue'
import { Title } from '@/components'
import axios from 'axios'

export default defineComponent({
  components: { Title },
  props: {
    modalOpened: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const comments = ref('')
    const isLoading = ref(false)

    // 한 컴퓨터에서 여러 아이디 생성되지 않도록
    let csID = localStorage.getItem('cs-id')
    if (csID === null) {
      csID = String(Date.now())
      localStorage.setItem('cs-id', csID)
    }
    const leaveComments = (e: Event) => {
      e.stopPropagation()
      if (!comments.value.trim()) {
        alert('문의 내용이 없어요')
        return
      }
      isLoading.value = true
      axios({
        url: 'https://us-central1-gitcabinet-bing.cloudfunctions.net/comments',
        method: 'POST',
        data: {
          csID,
          content: comments.value,
          createdAt: Date.now(),
        },
      })
        .then(() => {
          alert('전송되었어요. 감사합니다.')
          comments.value = ''
          isLoading.value = false
          emit('close-modal')
        })
        .catch(() => {
          alert('알 수 없는 오류가 발생했어요 죄송해요')
        })
    }
    const closeModal = (e: Event) => {
      e.stopPropagation()
      const target = e.target as HTMLElement
      if (target.textContent === '닫기' || target.classList.contains('modal-background')) {
        emit('close-modal')
      }
    }
    return {
      comments,
      isLoading,
      closeModal,
      leaveComments,
    }
  },
})
</script>

<style>
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
.loading-box {
  position: absolute;
  margin: auto;
  height: 50vh;
  border-radius: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 24rem;
  max-width: 40vw;
  background-color: #fffc;
  display: none;
}
.loading-active {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 24rem;
  max-width: 40vw;
  height: fit-content;
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 4px 1px #aaa;
}
.modal-content > *:not(:first-child) {
  margin-top: 1rem;
}
.modal-content textarea {
  border: 2px solid #000;
  border-radius: 8px;
  padding: 1rem;
}
.modal-content textarea:focus {
  border: 2px solid #000;
  outline: none;
}

.modal-content ul {
  margin-left: 2rem;
}

.modal-content textarea {
  width: 100%;
}

.modal-content li {
  list-style: disc;
}
.modal-content > div:first-child {
  text-align: center;
}
.modal-content > p {
  text-align: center;
}
.button-group {
  display: flex;
  justify-content: space-around;
}
.button-group > button {
  width: 8rem;
  height: 3rem;
  color: #fff;
  @apply bg-indigo-600 rounded;
}
.button-group > button:nth-child(2) {
  @apply bg-gray-500;
}
.repository {
  @apply text-gray-400;
  display: flex;
  justify-content: center;
}
.repository a {
  text-decoration: underline;
}
</style>

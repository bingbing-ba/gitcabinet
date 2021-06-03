<template>
  <div class="navbar">
    <div class="navbar-left">
      <Title>GIT CABINET</Title>
      <ProblemNavigator/>
      <ProblemResetButton/>
    </div>
    <div class="navbar-right">
      <ButtonDirectory @click="updateViewQueue(0)" />
      <ButtonGitGraph @click="updateViewQueue(1)" />
      <ButtonStagingArea @click="updateViewQueue(2)" />
      <ButtonRemote @click="updateViewQueue(3)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { 
  Title, 
  ButtonDirectory,
  ButtonGitGraph,
  ButtonStagingArea,
  ButtonRemote,
  ProblemNavigator, 
  ProblemResetButton, 
} from '@/components'

export default defineComponent({
  components: {
    Title,
    ButtonDirectory,
    ButtonGitGraph,
    ButtonStagingArea,
    ButtonRemote,
    ProblemNavigator,
    ProblemResetButton
  },
  props: {
  },
  setup(props, context) {
    const updateViewQueue = (nextViewIndex: number) => {
      context.emit('update-view-queue', nextViewIndex)
    }
    return {
      updateViewQueue
    }
  },
})
</script>

<style>
.navbar {
  @apply flex flex-wrap justify-between p-4 shadow z-50;
}

.navbar-left {
  @apply lg:w-2/4 flex items-center px-5 w-full;
}

.navbar-right {
  @apply space-x-4 px-5 w-full hidden sm:hidden lg:flex lg:justify-start lg:my-0 lg:w-2/4;
}
</style>

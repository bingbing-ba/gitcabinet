<template>
  <div class="navbar">
    <div class="navbar-left">
      <Title>GIT CABINET</Title>
      <ProblemNavigator/>
      <ProblemResetButton/>
    </div>
    <div class="navbar-right">
      <ButtonDirectory/>
      <ButtonGitGraph/>
      <ButtonStagingArea/>
      <ButtonRemote/>
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
  setup() {
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

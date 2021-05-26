<template>
  <div>
    <button @click="toggleEditMode" class="flex">
      <IconTextFile/> {{ file.filename }}
    </button>

    <transition name="slide">
      <DirectoryEditor 
        v-if="isEditMode" 
        :fileContent="fileContent" 
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { IconTextFile, DirectoryEditor } from '@/components'
import { PlainFile } from '@/git/fileStructure'

export default defineComponent({
  components: {
    IconTextFile,
    DirectoryEditor
  },
  props: {
    file: {
      type: PlainFile
    }
  },
  setup(props) {
    const isEditMode = ref(false)

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value
    }

    const fileContent = computed(() => {
      return props.file?.content || ''
    })
    
    return {
      isEditMode,
      toggleEditMode,
      fileContent
    }
  },
})
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.3s ease-in-out;
}

.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-to, 
.slide-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter-from, 
.slide-leave-to {
  max-height: 0;
  overflow: hidden;
}
</style>

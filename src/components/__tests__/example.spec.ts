import { mount } from '@vue/test-utils'
import GitDirectory from '@/components/organisms/GitDirectory.vue'

test('Git Directory', ()=>{
  const gitDirectory = mount(GitDirectory, {props:{}})

  expect(gitDirectory.text()).toContain('디렉토리')
})
import { cloneDeep } from 'lodash'
import { Directory } from '@/git/fileStructure'
import { Git } from '@/git/git'

interface answer extends Function {
  (refDirectory: Directory, git?: Git): boolean
}

export class Problem {
  title: string
  content?: string
  hint?: string
  refDirectory: Directory
  baseRefDirectory?: Directory
  git?: Git
  baseGit?: Git
  answer?: answer

  constructor(title: string) {
    this.title = title
    this.refDirectory = new Directory('directory')
  }

  setGit(git: Git, globalConfig?: { name: string; email: string }) {
    this.git = git
    if (globalConfig) {
      this.git.setUserConfig({ type: 'name', name: globalConfig.name })
      this.git.setUserConfig({ type: 'email', email: globalConfig.email })
    }
  }

  setAnswer(answer: answer) {
    this.answer = answer
  }

  setBase() {
    this.baseGit = cloneDeep(this.git)
    this.baseRefDirectory = cloneDeep(this.refDirectory)
  }

  resetToBase() {
    this.git = cloneDeep(this.baseGit)
    this.refDirectory = cloneDeep(this.baseRefDirectory) as Directory
  }

  isCorrect() {
    if (!this.answer) {
      throw new Error('answer function is not set! use setAnswer method')
    }
    return this.answer(this.refDirectory, this.git)
  }
}

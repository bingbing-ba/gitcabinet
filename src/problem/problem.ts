import { cloneDeep } from 'lodash'
import { Directory } from '@/git/fileStructure'
import { Git } from '@/git/git'


interface answer extends Function {
  (refDirectory: Directory, git?: Git): boolean
}

/**
 * 문제 클래스
 * 문제마다 디렉토리와 git이 있어서
 * 조작하여 문제 설정이나 정답 설정 가능
 */
export class Problem {
  /** @property 문제 제목 */
  title: string
  /** @property 문제 해결을 위한 이론 설명 */
  explanation?: string
  /** @property 문제 내용 */
  content?: string
  /** @property 문제의 환경이 되는 디렉토리 */
  refDirectory: Directory
  /** @property 문제의 base설정에 쓰일 디렉토리 */
  baseRefDirectory?: Directory
  /** @property 문제의 환경이 되는 git */
  git?: Git
  /** @property 문제의 base설정에 쓰일 git */
  baseGit?: Git
  answer?: answer

  /**
   * 현재 문제를 만들면서 내부적으로 디렉토리는 만들어지는 형태입니다.
   * git init 문제를 위해서 git은 자동으로 생성되지 않습니다.
   * @param title 문제 제목
   */
  constructor(title: string) {
    this.title = title
    this.refDirectory = new Directory('directory')
  }

  /**
   * 이 문제에 git을 설정합니다. 인자가 없으면 새로 git을 만듭니다.
   * @param git 이 Problem 인스턴스의 refDirectory를 참조하는 git instance이어야 합니다. 전달하지 않으면 새로 하나를 만듭니다.
   * @param globalConfig global user config 설정 흉내내기 위한 인자인데 미완성
   */
  setGit(git:Git=new Git(this.refDirectory), globalConfig?: { name: string; email: string }) {
    if (git.refDirectory !== this.refDirectory) {
      throw new Error('git.refDirectory is not refDirectory of this instance')
    }
    this.git = git
    if (globalConfig) {
      this.git.setUserConfig({ type: 'name', name: globalConfig.name })
      this.git.setUserConfig({ type: 'email', email: globalConfig.email })
    }

  }

  /**
   * 이 문제의 정답을 정의합니다.
   * 콜백 함수의 인자를 통해서 정답이 어떤 상태이어야 하는지 지정할 수 있습니다.
   * @param answer 콜백 함수입니다. 첫 인자로 refDirectory, 두 번째 인자로 git 인스턴스를 받습니다.
   */
  setAnswer(answer: answer) {
    this.answer = answer
  }

  /**
   * 현재 이 인스턴스의 git과 refDirectory의 복사본을 만들어서
   * base로 지정합니다. base는 문제를 풀다가 다시 처음 상태로 돌아오고 싶을 때 돌아갈 지점을 의미합니다.
   */
  setBase() {
    this.baseGit = cloneDeep(this.git)
    this.baseRefDirectory = cloneDeep(this.refDirectory)
  }


  /**
   * 미리 지정된 base를 통해서 현재 git과 refDirectory의 상태를 되돌리는 함수입니다.
   */
  resetToBase() {
    this.git = cloneDeep(this.baseGit)
    this.refDirectory = cloneDeep(this.baseRefDirectory) as Directory
  }

  /**
   * 현재 인스턴스의 git과 refDirectory가 정해둔 정답의 상태와 맞는지를 체크합니다.
   * @returns `boolean`, 정답이면 true
   */
  isCorrect() {
    if (!this.answer) {
      throw new Error('answer function is not set! use setAnswer method')
    }
    return this.answer(this.refDirectory, this.git)
  }
}

import { sha256 } from 'js-sha256'
import { PlainFile, Directory } from './fileStructure'
import {
  index,
  branches,
  tree,
  fileHashes,
  commit,
  statusToCommit,
  userConfig,
} from './gitTypes'

export class Git {
  /** @property `object`, staging area역할, key가 파일이름, value는 파일내용을 hash한 값 */
  index: index
  /** @property `string`, 활성화된 브랜치 이름 ex. master */
  head: string
  /** @property `object`, key가 브랜치이름, value가 가장 최신 commit hash */
  branches: branches
  /** @property `object`, key가 commit을 hash한 값, value는 commit 객체 */
  commits: { [key: string]: commit }
  /** @property `object`, key가 tree를 hash한 값, value는 tree 객체 */
  trees: { [key: string]: tree }
  /** @property `object` key가 파일 내용을 hash한 값, value는 hash전 원본 */
  fileHashes: fileHashes
  /** @property `object` user와 remote 정보  */
  config: {
    user: {
      name: string
      email: string
    }
    remote: {
      [key: string]: Git
    }
  }
  /** @property `Directory`, git의 추적 대상인 디렉토리  */
  refDirectory: Directory

  /**
   * `$ git init`하는 것과 동일
   * 기본 브랜치는 master입니다.
   * @param refDirectory 추적 대상이 될 디렉토리
   */
  constructor(refDirectory: Directory) {
    this.index = {}
    this.head = 'master'
    this.branches = {
      master: '',
    }
    this.commits = {}
    this.trees = {}
    this.fileHashes = {}
    this.config = {
      user: {
        name: '',
        email: '',
      },
      remote: {},
    }
    this.refDirectory = refDirectory
  }

  /**
   * 여러 파일을 hash하는 함수
   * @param files 파일객체 배열
   * @returns `object` key는 파일이름, value는 파일내용을 hash한 값.
   */
  hash(files: PlainFile[]) {
    const hashedFiles: fileHashes = {}
    files.forEach((file) => {
      hashedFiles[file.filename] = sha256(file.content)
    })
    return hashedFiles
  }

  /**
   * index(stage)와 refDir를 비교해서 staging되지 않은 변경사항을 return
   * @param passedNames 파일 이름 배열, 전달한 파일 이름에 대해서만 변경사항을 체크합니다. 전달하지 않으면 모든 변경사항 체크.
   * @returns `object` key는 unstaged, modified, deleted, value는 모두 파일 이름 배열
   */
  getStatusNotToCommit(passedNames?: string[]) {
    let filenames: string[] = []
    if (passedNames === undefined) {
      filenames = this.refDirectory.getChildrenName()
    } else {
      filenames = passedNames
    }

    const statusNotToCommit = {
      unstaged: new Array<string>(),
      modified: new Array<string>(),
      deleted: new Array<string>(),
    }
    const files = this.refDirectory.getFilesByName(filenames)
    const hashedPresentFiles = this.hash(files)
    // 현재 파일 목록으로 변경사항 확인
    for (const filename in hashedPresentFiles) {
      if (this.index[filename] === undefined) {
        statusNotToCommit.unstaged.push(filename)
        continue
      }
      if (this.index[filename] !== hashedPresentFiles[filename]) {
        statusNotToCommit.modified.push(filename)
        continue
      }
    }

    // status에 인자 안 준 경우, 즉 모든 변경사항을 다 추적해야됨
    if (passedNames === undefined) {
      for (const filename in this.index) {
        if (!this.refDirectory.isExist(filename)) {
          statusNotToCommit.deleted.push(filename)
        }
      }
    } else {
      // 아닌 경우 인자로 넘겨준 것 들에 대해서만 status 추적
      for (const filename of filenames) {
        // 삭제에 들어와야하는 것? index에는 있고, dir에는 없는 것
        if (
          Object.keys(this.index).includes(filename) &&
          !this.refDirectory.isExist(filename)
        ) {
          statusNotToCommit.deleted.push(filename)
        }
      }
    }

    return statusNotToCommit
  }

  /**
   * index(stage)와 최신 commit의 tree를 비교해서 commit할 수 있는 변경사항을 return
   * @returns `object` key는 created, modified, deleted, value는 모두 파일 이름 배열
   */
  getStatusToCommit() {
    const statusToCommit = {
      created: new Array<string>(),
      modified: new Array<string>(),
      deleted: new Array<string>(),
    }

    const isAnyCommit = this.branches[this.head] !== ''
    const recentCommit = this.commits[this.branches[this.head]]
    for (const filename in this.index) {
      // 아직 아무런 commit이 존재하지 않음
      if (!isAnyCommit) {
        statusToCommit.created.push(filename)
      } else {
        const tree = this.trees[recentCommit.tree]
        if (tree[filename] === undefined) {
          statusToCommit.created.push(filename)
        } else if (tree[filename] !== this.index[filename]) {
          statusToCommit.modified.push(filename)
        }
      }
    }
    if (isAnyCommit) {
      for (const filename in this.trees[recentCommit.tree]) {
        if (this.index[filename] === undefined) {
          statusToCommit.deleted.push(filename)
        }
      }
    }
    return statusToCommit
  }

  /**
   * `$ git status` 와 같은 역할을 하는 함수
   * @param filenames 파일 이름 배열, 변경 사항 추적 대상이 됩니다. 넣지 않으면 모든 변경사항을 대상으로 합니다.
   * @returns `object`, statusNotToCommit과 statusToCommit이 들어있습니다.
   */
  status(filenames?: string[]) {
    return {
      statusNotToCommit: this.getStatusNotToCommit(filenames),
      statusToCommit: this.getStatusToCommit(),
    }
  }

  /**
   * `$ git config user.name 이름` 명령어 역할
   * name or email 세팅이 가능합니다.
   * @param data 세팅할 유저 정보
   */
  setUserConfig(data: userConfig) {
    if (data.type === 'name') {
      this.config.user.name = data.name
    } else {
      this.config.user.email = data.email
    }
  }

  /**
   * `$ git config user.name` 명령어 역할
   * 이름이나 이메일 가져올 때 사용
   * @param data 이름 or 이메일
   * @returns 설정된 이름 or 이메일
   */
  getUserConfig(data: { type: 'name' | 'email' }) {
    return this.config.user[data.type]
  }

  /**
   * `$ git add` 명령어 역할, 변경사항을 staging 합니다.
   * @param passedNames 파일 이름 배열, 전달하지 않으면 .(현재 디렉토리의 모든 변경사항)으로 동작
   */
  add(passedNames?: string[]) {
    // unstaged나 modified에 있는 녀석들은 hashing하고 index에 추가
    // deleted에 있는 녀석들은 index에서 삭제
    // 없는애들은 암것도 안함
    let filenames: string[] = []
    if (passedNames === undefined) {
      filenames = this.refDirectory.getChildrenName()
    } else {
      filenames = passedNames
    }

    // undefined일 때 모든 변경사항을 받아오기 위해 일부러 passedNames를 전달함
    const { deleted } = this.getStatusNotToCommit(passedNames)
    // delete된 파일은 없고 unstaged나 modified된 녀석들만 아래 files에 있음
    const files = this.refDirectory.getFilesByName(filenames)
    const hashedFiles = files.map((file) => {
      return {
        filename: file.filename,
        content: file.content,
        hash: sha256(file.content),
      }
    })
    for (const hashedFile of hashedFiles) {
      if (this.fileHashes[hashedFile.hash] === undefined) {
        this.fileHashes[hashedFile.hash] = hashedFile.content
      }
      this.index[hashedFile.filename] = hashedFile.hash
    }
    for (const filename of deleted) {
      delete this.index[filename]
    }
  }

  /**
   * `$ git commit -m`의 역할을 하는 함수
   * @param message 커밋메세지
   */
  commit(message: string) {
    const statusToCommit = this.getStatusToCommit()
    const isAnyChange = Object.keys(statusToCommit).reduce((prev, curr) => {
      return prev + statusToCommit[curr as keyof statusToCommit].length
    }, 0)

    if (!isAnyChange) {
      return
    }

    const tree = Object.assign({}, this.index)
    const treeHash = sha256(JSON.stringify(tree))
    this.trees[treeHash] = tree

    const commitObj: commit = {
      tree: treeHash,
      // 현재 branch의 가장 최신 commit hash, 처음 commit은 빈 배열로 parent
      parent: this.branches[this.head] ? [this.branches[this.head]] : [],
      author: {
        name: this.config.user.name,
        email: this.config.user.email,
      },
      createdAt: Date.now(),
      message,
    }
    const commitHash = sha256(JSON.stringify(commitObj))
    this.commits[commitHash] = commitObj
    this.branches[this.head] = commitHash
  }

  /**
   * 인자로 넘긴 브랜치 이름의 가장 최근 commit 객체를 리턴합니다.
   * 아무런 commit이 없다면 undefined를 리턴합니다.
   * @param branchName 브랜치 이름입니다. default는 master
   * @returns commit | undefined
   */
  getMostRecentCommit(branchName: string = 'master') {
    const mostRecentCommitHash = this.branches[branchName]
    if (mostRecentCommitHash === undefined) {
      throw new Error(`there is no branch name of ${branchName}`)
    }
    return this.commits[mostRecentCommitHash] as commit | undefined
  }

  /**
   * 인자로 넘긴 브랜치의 가장 최근 커밋이 가리키는 tree 객체를 리턴합니다.
   * 아직 아무 커밋이 없다면 undefined를 리턴합니다.
   * @param branchName 브랜치 이름입니다. default는 master
   * @returns tree | undefined
   */
  getTreeOfMostRecentCommit(branchName: string = 'master') {
    const mostRecentCommit = this.getMostRecentCommit(branchName)
    const treeHash = mostRecentCommit?.tree
    return treeHash === undefined ? treeHash : this.trees[treeHash]
  }

  /**
   * 인덱스(staging area)에 해당 파일이 존재하는지를 검사합니다.
   * @param file 파일 인스턴스
   * @returns boolean
   */
  isExistAtIndex(file: PlainFile) {
    if (this.index.hasOwnProperty(file.filename)) {
      // 해당 파일이름이 index에 존재하고 내용도 일치하는지 확인
      return this.index[file.filename] === sha256(file.content)
    }
    return false
  }

  /**
   * 가장 최근 커밋 기록에 해당 파일 존재하는지 검사합니다.
   * @param file 파일 인스턴스
   * @param branchName 브랜치 이름, default값은 master
   * @returns boolean
   */
  isExistAtRecentCommit(file: PlainFile, branchName: string='master') {
    const tree = this.getTreeOfMostRecentCommit(branchName)
    if (tree) {
      // tree에 파일 이름 존재하고, 파일 이름도 같은지 확인
      if (tree.hasOwnProperty(file.filename)) {
        return tree[file.filename] === sha256(file.content)
      }
    }
    return false
  }

  /**
   * `$ git remote add origin remote.url.com` 명령어 역할을 하는 함수
   * 구현 상 remote는 아예 다른 git 인스턴스를 가리키게 하였습니다.
   * @param remoteName 리모트 별칭, ex. origin
   * @param remoteGit 리모트 깃 저장소
   */
  setRemoteConfig(remoteName: string, remoteGit: Git) {
    this.config.remote[remoteName] = remoteGit
  }

  pull(remoteName: string, branch: string) {
    // 1. remote의 branch의 가장 최신 commit이랑 내 branch랑 비교
    // pull이니까 내 commithash를 remote의 head부터 차례로 찾아들어감
    // 2. 일치하는 게 나오기 전까지 commit
  }
}

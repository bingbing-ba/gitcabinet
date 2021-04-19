import { sha256 } from 'js-sha256'
import { PlainFile, Directory } from './fileStructure'

interface hashObj {
  [key: string]: string
}

interface commit {
  tree: string
  parent: string[]
  author: string
  message: string
}

interface nameConfig {
  type: 'name'
  name: string
}

interface emailConfig {
  type: 'email'
  email: string
}

type userConfig = nameConfig | emailConfig

interface statusToCommit {
  created: string[]
  modified: string[]
  deleted: string[]
}

export class Git {
  index: hashObj
  head: string
  branches: hashObj
  commits: { [key: string]: commit }
  trees: { [key: string]: hashObj }
  fileHashes: hashObj
  config: {
    user: {
      name: string
      email: string
    }
    remote: {
      [key: string]: string
    }
  }
  refDir: Directory

  constructor(refDir: Directory) {
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
    this.refDir = refDir
  }

  hash(files: PlainFile[]) {
    const hashedFiles: hashObj = {}
    files.forEach((file) => {
      hashedFiles[file.filename] = sha256(file.content)
    })
    return hashedFiles
  }

  getStatusNotToCommit(passedNames?: string[]) {
    let filenames: string[] = []
    if (passedNames === undefined) {
      filenames = this.refDir.getChildrenName()
    } else {
      filenames = passedNames
    }

    const statusNotToCommit = {
      unstaged: new Array<string>(),
      modified: new Array<string>(),
      deleted: new Array<string>(),
    }
    const files = this.refDir.getFilesByName(filenames)
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
        if (!this.refDir.isExist(filename)) {
          statusNotToCommit.deleted.push(filename)
        }
      }
    } else { // 아닌 경우 인자로 넘겨준 것 들에 대해서만 status 추적
      for (const filename of filenames) {
        // 삭제에 들어와야하는 것? index에는 있고, dir에는 없는 것
        if (
          Object.keys(this.index).includes(filename) &&
          !this.refDir.isExist(filename)
        ) {
          statusNotToCommit.deleted.push(filename)
        }
      }
    }

    return statusNotToCommit
  }

  getStatusToCommit() {
    const statusToCommit: statusToCommit = {
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

  status(filenames?: string[]) {
    return {
      statusNotToCommit: this.getStatusNotToCommit(filenames),
      statusToCommit: this.getStatusToCommit(),
    }
  }

  setUserConfig(data: userConfig) {
    if (data.type === 'name') {
      this.config.user.name = data.name
    } else {
      this.config.user.email = data.email
    }
  }

  getUserConfig(data: { type: 'name' | 'email' }) {
    return this.config.user[data.type]
  }

  // setRemoteConfig(remoteName:string, url:string) {
  //   if (this.config.remote[remoteName])
  // }

  add(passedNames?: string[]) {
    // unstaged나 modified에 있는 녀석들은 hashing하고 index에 추가
    // deleted에 있는 녀석들은 index에서 삭제
    // 없는애들은 암것도 안함
    let filenames:string[] = []
    if (passedNames === undefined) {
      filenames = this.refDir.getChildrenName()
    }else{
      filenames = passedNames
    }

    // undefined일 때 모든 변경사항을 받아오기 위해 일부러 passedNames를 전달함
    const { deleted } = this.getStatusNotToCommit(passedNames)
    // delete된 파일은 없고 unstaged나 modified된 녀석들만 아래 files에 있음
    const files = this.refDir.getFilesByName(filenames)
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
      author: `${this.config.user.name} ${
        this.config.user.email
      } ${Date.now()}`,
      message,
    }
    const commitHash = sha256(JSON.stringify(commitObj))
    this.commits[commitHash] = commitObj
    this.branches[this.head] = commitHash
  }
}

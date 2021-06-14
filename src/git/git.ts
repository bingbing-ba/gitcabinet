import { sha256 } from 'js-sha256'
import { cloneDeep } from 'lodash'
import { PlainFile, Directory } from './fileStructure'
import {
  index,
  branches,
  tree,
  fileHashes,
  commit,
  statusToCommit,
  statusNotToCommit,
  userConfig,
  PushRejectedError,
} from './gitTypes'

export class Git {
  /** @property `object`, staging area역할, key가 파일이름, value는 파일내용을 hash한 값 */
  index: index
  /** @property `string`, 활성화된 브랜치 이름 ex. master */
  head: string
  /** @property `string`, 병합 시 target브랜치의 head commit hash, 병합 중이 아니면 빈 문자열 */
  mergeHead: string
  /** @property `string[]`, 병합 시 충돌이 발생한 filename이 요소로 들어감 */
  conflicts: string[]
  /** @property `object`, key가 브랜치이름, value가 가장 최신 commit hash */
  branches: branches
  /** @property `object`, key가 remote 이름(ex. origin), branches 객체 */
  remoteBranches: {
    [key: string]: branches
  }
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
    this.mergeHead = ''
    this.conflicts = []
    this.branches = {
      master: '',
    }
    this.remoteBranches = {}
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
   * @returns result: 'success' or 'fail', message: 부가 설명
   */
  commit(message: string) {
    const statusToCommit = this.getStatusToCommit()
    const isAnyChange = Object.keys(statusToCommit).reduce((prev, curr) => {
      return prev + statusToCommit[curr as keyof statusToCommit].length
    }, 0)

    if (!isAnyChange) {
      return {
        result: 'fail',
        message: 'there is no change',
        hash: '',
      }
    }

    // 병합 중 충돌된 파일이 있는 경우 충돌된 파일이 모두 staging 되어야 함
    if (this.conflicts.length > 0) {
      let allConflictsStaged = true
      const { created, deleted, modified } = statusToCommit
      for (const filename of this.conflicts) {
        const conflictStaged =
          created.includes(filename) ||
          modified.includes(filename) ||
          deleted.includes(filename)
        allConflictsStaged = allConflictsStaged && conflictStaged
      }
      if (!allConflictsStaged) {
        return {
          result: 'fail',
          message: 'there are still not merged files',
          hash: '',
        }
      }
    }

    const tree = Object.assign({}, this.index)
    const treeHash = sha256(JSON.stringify(tree))
    this.trees[treeHash] = tree

    // 현재 branch의 가장 최신 commit hash, 처음 commit이라면 빈 배열로 parent
    const parent = []
    if (this.branches[this.head]) {
      // 병합 중이라면
      if (this.mergeHead) {
        parent.push(this.mergeHead, this.branches[this.head])
      } else {
        parent.push(this.branches[this.head])
      }
    }
    const commitObj: commit = {
      tree: treeHash,
      parent,
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
    if (this.mergeHead) {
      this.mergeHead = ''
      this.conflicts = []
      return {
        result: 'success',
        message: 'merged',
        hash: commitHash,
      }
    }
    return {
      result: 'success',
      message: '',
      hash: commitHash,
    }
  }

  /**
   * 인자로 넘긴 브랜치 이름의 가장 최근 commit 객체를 리턴합니다.
   * 아무런 commit이 없다면 undefined를 리턴합니다.
   * @param branchName 브랜치 이름입니다. default는 master
   * @returns commit | undefined
   */
  getMostRecentCommit(branchName = 'master') {
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
  getTreeOfMostRecentCommit(branchName = 'master') {
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
  isExistAtRecentCommit(file: PlainFile, branchName = 'master') {
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
  addRemote(remoteName: string, remoteGit: Git) {
    if (this.config.remote[remoteName] !== undefined) {
      throw new Error(`already exist remote name ${remoteName}`)
    }
    this.config.remote[remoteName] = remoteGit
    this.remoteBranches[remoteName] = {}
  }

  /**
   * `$ git fetch origin master` 명령어 역할을 하는 함수
   * remote의 해당 브랜치의 모든 commit과 tree, file hash 중에 여기 없는 걸 다 복사해옵니다
   * @param remoteName remote 이름
   * @param branchName remote의 브랜치 이름, 생략하면 모든 브랜치 다 fetch
   */
  fetch(remoteName: string, branchName?: string) {
    if (this.config.remote[remoteName] === undefined) {
      throw new Error(`there is no remote name ${remoteName}`)
    }
    const remote = this.config.remote[remoteName]
    const remoteBranches = []
    if (!branchName) {
      remoteBranches.push(...Object.keys(remote.branches))
    } else {
      if (remote.branches[branchName]===undefined) {
        throw new Error(`there is no brance name ${branchName}`)
      }
      remoteBranches.push(branchName)
    }
    remoteBranches.forEach(branchName=>{
      if (this.remoteBranches[remoteName][branchName] === remote.branches[branchName]) {
        return
      }
      const commitHashStack = [remote.branches[branchName]]
      while(commitHashStack.length){
        const remoteCommitHash = commitHashStack.pop() as string
        if (this.commits[remoteCommitHash] !== undefined) {
          continue
        }
        const remoteCommit = remote.commits[remoteCommitHash]
        const remoteTree = remote.trees[remoteCommit.tree]
        this.commits[remoteCommitHash] = {...remoteCommit}
        this.trees[remoteCommit.tree] = {...remoteTree}
        
        Object.values(remoteTree).forEach(contentHash=>{
          if (this.fileHashes[contentHash] === undefined) {
            this.fileHashes[contentHash] = remote.fileHashes[contentHash]
          }
        })
        commitHashStack.push(...remoteCommit.parent)
      }
      this.remoteBranches[remoteName][branchName] = remote.branches[branchName]
    })
  }

  /**
   * `$ git pull origin master` 명령어의 역할을 하는 함수
   * fetch + merge
   * @param remoteName remote 이름
   * @param branchName remote의 브랜치 이름
   */
  pull(remoteName: string, branchName: string) {
    this.fetch(remoteName, branchName)
    this.merge({remote:true, branchName, remoteName})
  }

  push(remoteName: string, branchName: string) {
    const remote = this.config.remote[remoteName]
    if (this.config.remote[remoteName] === undefined) {
      throw new Error(`there is no remote name ${remoteName}`)
    }
    let remoteHead = remote.branches[branchName]
    if (remoteHead === undefined) {
      remote.branches[branchName] = ''
      remoteHead = ''
    }
    // remote의 해당 브랜치에 내가 가지지 않은 commit이 존재할때는 무조건 pull먼저
    if (remoteHead!=='' && !this.getAllCommitHahes(this.branches[this.head]).includes(remoteHead)){
      
      throw new PushRejectedError(`현재 브랜치의 끝이 remote 브랜치보다 뒤에 있으므로 push가 거부되었습니다. 'git pull ... '등으로 remote의 변경사항을 먼저 포함하세요`)
    }
    remote.switch(branchName)
    remote.addRemote(remoteName, this)
    remote.pull(remoteName, branchName)
    delete remote.config.remote[remoteName]
    
  }

  /**
   * 어떤 commit hash부터 부모를 타고 가서 첫 commit hash까지 모든 commit hash를 모아 return 하는 함수.
   * merge에 사용할 용도로 만들었습니다.
   * @param sourceCommitHash 기준점이 되는 commit hash
   * @returns sourceCommitHash가 처음, 첫 commitHash가 마지막 요소인 모든 commit hash 모은 배열
   */
  getAllCommitHahes(sourceCommitHash: string) {
    const commit = this.commits[sourceCommitHash]
    if (!commit) {
      throw new Error(`there is no commit ${sourceCommitHash}`)
    }

    const q = [sourceCommitHash]
    const allCommitHashes = []
    const visited = {
      sourceCommitHash: true,
    } as { [key: string]: boolean }
    while (q.length) {
      const commitHash = q.pop()
      allCommitHashes.push(commitHash)
      const commit = this.commits[commitHash!]
      commit.parent.forEach((parentCommitHash) => {
        if (!visited[parentCommitHash]) {
          q.unshift(parentCommitHash)
        }
      })
    }
    return allCommitHashes
  }

  /**
   * `$ git switch 브랜치` 명령어 역할을 하는 함수. 브랜치를 전환함.
   * create를 통해 `-c` 옵션 주었을 때 역할도 함.
   * 구현 편의를 위해 commit되지 않은 변경사항이 있을 때 switch를 금지하였음
   * @param branch 전환할 브랜치 이름
   * @param create 브랜치를 생성할 것인지 옵션
   */
  switch(branch: string, option?:{create:boolean}) {
    const branches = Object.keys(this.branches)
    const {statusToCommit, statusNotToCommit} = this.status()
    let anyStatus = false
    Object.keys(statusToCommit).forEach(key=>{
      anyStatus ||= statusToCommit[key as keyof statusToCommit].length > 0
    })
    Object.keys(statusNotToCommit).forEach(key=>{
      anyStatus ||= statusNotToCommit[key as keyof statusNotToCommit].length > 0
    })
    if (anyStatus) {
      throw new Error('구현의 편의를 위해 switch할 때 commit되지 않은 변경사항을 허용하지 않습니다.')
    }

    if (option?.create) {
      if (branches.includes(branch)) {
        throw new Error(`already exist branch name ${branch}`)
      }
      this.branches[branch] = this.branches[this.head]
    } else {
      if (!branches.includes(branch)) {
        throw new Error(`no name of branch ${branch}`)
      }
      let targetTree = undefined
      if (this.branches[branch]==='') {
        targetTree = {}
      }else{
        const targetCommit = this.commits[this.branches[branch]]
        targetTree = this.trees[targetCommit.tree]
      }
      this.refDirectory.setDirectoryByTree(targetTree, this.fileHashes)
      this.index = cloneDeep(targetTree) 

    }
    this.head = branch
  }

  /**
   * 커밋 해시 하나만 전달하면, 그 커밋의 tree를 기준으로 index와 directory 업데이트
   * 병합 시만 사용, 두개 전달하면 conflict 파악해서 발생한 경우 filecontent도 업데이트
   * @param sourceCommitHash update 대상이 되는 commit의 hash
   * @param targetCommitHash 병합할 때만 사용하는 target commit hash
   */
  updateIndexAndDirectory(sourceCommitHash: string, targetCommitHash?: string) {
    const sourceCommit = this.commits[sourceCommitHash]
    const sourceTree = this.trees[sourceCommit.tree]
    const conflicts = []
    if (targetCommitHash) {
      const targetCommit = this.commits[targetCommitHash]
      const targetTree = this.trees[targetCommit.tree]
      // conflict 검사
      for (const filename of Object.keys(sourceTree)) {
        if (targetTree[filename]) {
          if (sourceTree[filename] !== targetTree[filename]) {
            conflicts.push(filename)
          }
        }
      }
      this.index = { ...targetTree, ...sourceTree }
      this.refDirectory.setDirectoryByTree(this.index, this.fileHashes)
      if (conflicts.length > 0) {
        const conflictedFiles = this.refDirectory.getFilesByName(conflicts)
        for (const file of conflictedFiles) {
          const sourceFileContent = this.fileHashes[sourceTree[file.filename]]
          const targetFileContent = this.fileHashes[targetTree[file.filename]]
          file.content = `<<<<<<< HEAD
          ${sourceFileContent}
          =======
          ${targetFileContent}
          >>>>>>>
          `
        }
        this.conflicts = [...conflicts]
      }
    } else {
      this.index = { ...sourceTree }
      this.refDirectory.setDirectoryByTree(this.index, this.fileHashes)
    }
  }

  /**
   * 현재 브랜치의 status에 해당 파일이 존재하는지를 체크하는 함수
   * @param filename 파일 이름
   * @returns boolean
   */
  isExistAtStatus(filename:string) {
    // 비 반복적인 코드를 짜고 싶으나... 다양한 시도 끝에 포기
    const {statusNotToCommit, statusToCommit} = this.status()
    let isExist = false
    isExist ||= statusNotToCommit.unstaged.includes(filename)
    isExist ||= statusNotToCommit.modified.includes(filename)
    isExist ||= statusNotToCommit.deleted.includes(filename)
    isExist ||= statusToCommit.created.includes(filename)
    isExist ||= statusToCommit.modified.includes(filename)
    isExist ||= statusToCommit.deleted.includes(filename)
    return isExist
  }

  /**
   * `git merge targetBranch` 명령어 역할의 함수, targetBranch의 commit을 현재 브랜치에 적용합니다.
   * non fast forward일 때 conflict가 없으면 내부적으로 commit 실행
   * conflict 발생하면 commit 하지않은채로 종료. conflict 해결해야함.
   * @param targetBranch 병합 대상 브랜치
   * @param mergeCommitMessage non fast forward 병합, conflict 없을 때 사용할 커밋 메세지
   * @returns 병합 결과 메세지
   */
  merge(
    targetBranch:
      | { remote: true; remoteName: string; branchName: string }
      | { remote: false; branchName: string },
    mergeCommitMessage?: string
  ) {
    // 먼저 remote랑 브랜치 이름 검사
    let targetHeadCommitHash = undefined
    if (targetBranch.remote) {
      const remoteBranches = this.remoteBranches[targetBranch.remoteName]
      if (!remoteBranches) {
        throw new Error(`There is no remoteName ${targetBranch.remoteName}`)
      }
      targetHeadCommitHash = remoteBranches[targetBranch.branchName]
      if (!targetHeadCommitHash) {
        throw new Error(`There is no branchName ${targetBranch.branchName}`)
      }
    } else {
      targetHeadCommitHash = this.branches[targetBranch.branchName]
      if (!targetHeadCommitHash) {
        throw new Error(`There is no branchName ${targetBranch.branchName}`)
      }
    }

    // source브랜치의 commit 되지 않은 변경사항이 있는 파일이 target브랜치의 tree에 존재할때는 merge 불가능
    const targetTree = this.trees[this.commits[targetHeadCommitHash].tree]
    for (const filename in targetTree) {
      if(this.isExistAtStatus(filename)) {
        throw new Error(`cannot merge because of uncommited change, ${filename}`)
      }
    }
    

    const sourceHeadCommitHash = this.branches[this.head]
    if (!sourceHeadCommitHash) {
      // source에 아무런 커밋 없을 때,ff
      this.branches[this.head] = targetHeadCommitHash
      this.updateIndexAndDirectory(targetHeadCommitHash)
      return 'fast forward'
    }

    // 일치하는 source commit 찾기 - 그냥 가장 마지막 hash가 같은지만 비교하면 되네
    const allSourceCommitHashes = this.getAllCommitHahes(sourceHeadCommitHash)
    const allTargetCommitHashes = this.getAllCommitHahes(targetHeadCommitHash)
    if (
      allSourceCommitHashes[allSourceCommitHashes.length - 1] !==
      allTargetCommitHashes[allTargetCommitHashes.length - 1]
    ) {
      throw new Error('unable to merge, there is no common commit')
    }

    // target head가 이미 source에 포함되어있어서 merge할게 없다면
    if (allSourceCommitHashes.includes(targetHeadCommitHash)) {
      return 'already updated'
    }
    // source head가 target에 포함되어있다면 - fast-forward
    if (allTargetCommitHashes.includes(sourceHeadCommitHash)) {
      this.branches[this.head] = targetHeadCommitHash
      this.updateIndexAndDirectory(targetHeadCommitHash)
      return 'fast forward'
    }

    // non fast forward
    this.updateIndexAndDirectory(sourceHeadCommitHash, targetHeadCommitHash)
    this.mergeHead = targetHeadCommitHash
    if (this.conflicts.length === 0) {
      // no conflict, 바로 커밋
      this.commit(
        mergeCommitMessage || `merge branch ${targetBranch.branchName}`
      )
      return 'non fast forward merged'
    } else {
      // conflict, 커밋 할 수 없어 종료
      return 'conflict occured, merge failed'
    }
  }
}

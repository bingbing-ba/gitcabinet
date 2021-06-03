import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'
import { status } from '../gitTypes'

describe('branch and merge', ()=>{
  let git: Git
  const initFiles = () => {
    const first = new PlainFile('first', git.refDirectory)
    const second = new PlainFile('second', git.refDirectory)
    const third = new PlainFile('third', git.refDirectory)
    return {
      first,
      second,
      third,
    }
  }
  beforeEach(() => {
    git = new Git(new Directory('status'))
  })

  it('switch', ()=>{
    const files = initFiles()
    git.add()
    git.commit('master')
    git.switch('dev', {create:true})
    git.refDirectory.delete(files.third)
    git.add()
    const devCommitHash = git.commit('delete third at dev').hash

    // switch 했을 때 head가 바꾼 브랜치 이름이고, head commit이 해당 브랜치의 가장 최근 commit인지
    expect(git.head).toEqual('dev')
    expect(git.branches[git.head]).toEqual(devCommitHash)
    const devTree = git.trees[git.commits[devCommitHash].tree]

    // master에서 third있었지만, dev에서 third 지운이후에 dev commit의 tree에 third 없는지 확인
    expect(Object.keys(devTree).includes(files.third.filename)).toEqual(false)
    // index에도 없어야함
    expect(git.isExistAtIndex(files.third)).toEqual(false)
    // directory에도 없어야함
    expect(git.refDirectory.isExist(files.third.filename)).toEqual(false)
    git.switch('master')
    const masterTree = git.trees[git.commits[git.branches[git.head]].tree]

    // master로 돌아오면 tree에도, index에도, 디렉토리에도 third 존재해야함.
    expect(Object.keys(masterTree).includes(files.third.filename)).toEqual(true)
    expect(git.isExistAtIndex(files.third)).toEqual(true)
    expect(git.refDirectory.isExist(files.third.filename)).toEqual(true)
  })

  it('merge, fast forward', ()=>{
    new PlainFile('first', git.refDirectory)
    git.add()
    git.commit('first')
    git.switch('dev', {create:true})
    const second = new PlainFile('second', git.refDirectory)
    git.add()
    git.commit('second')
    git.switch('master')

    // dev에서 새로 second 만든 이후에 다시 master로 가면 second 없음
    expect(git.isExistAtIndex(second)).toEqual(false)
    expect(git.refDirectory.isExist(second.filename)).toEqual(false)
    const result = git.merge({remote:false, branchName:'dev'})

    // merge하면 ff방식이고, master와 dev가 가리키는 커밋 같고, master에 second 존재해야함.
    expect(result).toEqual('fast forward')
    expect(git.branches.master).toEqual(git.branches.dev)
    expect(git.isExistAtIndex(second)).toEqual(true)
    expect(git.refDirectory.isExist(second.filename)).toEqual(true)
  })

  it('merge, non-ff, no-conflict', ()=>{
    new PlainFile('first', git.refDirectory)
    git.add()
    git.commit('first')
    git.switch('dev', {create:true})
    const second = new PlainFile('second', git.refDirectory)
    git.add()
    git.commit('second')
    git.switch('master')
    new PlainFile('third', git.refDirectory)
    git.add()
    git.commit('third')
    const result = git.merge({remote:false, branchName:'dev'})

    // dev에서 second, master에서 third 만들어서 merge 하므로 non-ff
    // no-conflict, master에는 병합용 commit하나더 생김, second 병합이후에 index랑 디렉토리 둘다 생김
    expect(result).toEqual('non fast forward merged')
    expect(git.branches.master).not.toEqual(git.branches.dev)
    expect(git.isExistAtIndex(second)).toEqual(true)
    expect(git.refDirectory.isExist(second.filename)).toEqual(true)
    const headCommit = git.commits[git.branches[git.head]]

    // head=master의 parent에 dev의 가장 최신 커밋이 포함되어 있음. 총 커밋 수 4개(병합용 커밋 생겨서)
    expect(headCommit.parent.length).toEqual(2)
    expect(headCommit.parent.includes(git.branches.dev))
    expect(Object.keys(git.commits).length).toEqual(4)
  })

  it('merge, non-ff, conflict', ()=>{
    const first = new PlainFile('first', git.refDirectory)
    git.add()
    git.commit('first')
    git.switch('dev', {create:true})
    first.content = 'dev'
    git.add()
    const devCommitHash = git.commit('second').hash
    git.switch('master')
    first.content = 'master'
    git.add()
    git.commit('conflict')
    const result = git.merge({remote:false, branchName:'dev'})

    // dev에서도 first를 수정하고, master에서도 first를 수정하여 merge하려는 시도,
    // non-ff, conflict 발생
    expect(result).toEqual('conflict occured, merge failed')
    expect(git.mergeHead).toEqual(devCommitHash)
    expect(git.conflicts.includes(first.filename)).toEqual(true)
    
    // conflict 일어나서 병합해야하는 파일 modified 상태로 존재
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [],
        modified: [first.filename],
        deleted: [],
      },
      statusToCommit: {
        created: [],
        modified: [],
        deleted: [],
      },
    } as status)
    
    // 충돌 해결 중인 파일에 dev에서 작성한 내용과 master에서 작성한 내용 모두 존재
    expect(git.refDirectory.getFilesByName([first.filename])[0].content.includes('dev')).toEqual(true)
    expect(git.refDirectory.getFilesByName([first.filename])[0].content.includes('master')).toEqual(true)

    git.add(['second'])
    const notStagingConflictResult = git.commit('solve conflict')
    // first staging 안하면 commit 실패
    expect(notStagingConflictResult.result).toEqual('fail')
    expect(git.mergeHead).toEqual(devCommitHash)
    expect(git.conflicts).toEqual([first.filename])

    
    git.add()
    git.commit('solve conflict')
    // 충돌 난 파일 staging 하면 merge commit 생성되고 merge 완료.
    expect(git.mergeHead).toEqual('')
    expect(git.conflicts).toEqual([])
    
  })
})
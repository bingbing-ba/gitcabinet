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
    const masterCommitHash = git.commit('master').hash
    git.switch('dev', {create:true})
    git.refDirectory.delete(files.third)
    git.add()
    const devCommitHash = git.commit('delete third at dev').hash
    expect(git.head).toEqual('dev')
    expect(git.branches[git.head]).toEqual(devCommitHash)
    const devTree = git.trees[git.commits[devCommitHash].tree]
    expect(Object.keys(devTree).includes(files.third.filename)).toEqual(false)
    expect(git.isExistAtIndex(files.third)).toEqual(false)
    expect(git.refDirectory.isExist(files.third.filename)).toEqual(false)
    git.switch('master')
    const masterTree = git.trees[git.commits[git.branches[git.head]].tree]
    expect(Object.keys(masterTree).includes(files.third.filename)).toEqual(true)
    expect(git.isExistAtIndex(files.third)).toEqual(true)
    expect(git.refDirectory.isExist(files.third.filename)).toEqual(true)
  })

  it('merge, fast forward', ()=>{
    const first = new PlainFile('first', git.refDirectory)
    git.add()
    git.commit('first')
    git.switch('dev', {create:true})
    const second = new PlainFile('second', git.refDirectory)
    git.add()
    git.commit('second')
    git.switch('master')
    expect(git.isExistAtIndex(second)).toEqual(false)
    expect(git.refDirectory.isExist(second.filename)).toEqual(false)
    const result = git.merge({remote:false, branchName:'dev'})
    expect(result).toEqual('fast forward')
    expect(git.isExistAtIndex(second)).toEqual(true)
    expect(git.refDirectory.isExist(second.filename)).toEqual(true)
  })

  it('merge, non-ff, no-conflict', ()=>{
    const first = new PlainFile('first', git.refDirectory)
    git.add()
    git.commit('first')
    git.switch('dev', {create:true})
    const second = new PlainFile('second', git.refDirectory)
    git.add()
    git.commit('second')
    git.switch('master')
    const third = new PlainFile('third', git.refDirectory)
    git.add()
    git.commit('third')
    const result = git.merge({remote:false, branchName:'dev'})
    expect(result).toEqual('non fast forward merged')
    expect(git.isExistAtIndex(second)).toEqual(true)
    expect(git.refDirectory.isExist(second.filename)).toEqual(true)
    const headCommit = git.commits[git.branches[git.head]]
    expect(headCommit.parent.length).toEqual(2)
    expect(headCommit.parent.includes(git.branches.dev))
    expect(Object.keys(git.commits).length).toEqual(4)
  })

  it('merge, non-ff, conflict', ()=>{
    let first = new PlainFile('first', git.refDirectory)
    git.add()
    git.commit('first')
    git.switch('dev', {create:true})
    first = git.refDirectory.getFileByFilename(first.filename) || first
    first.content = 'dev'
    git.add()
    const devCommitHash = git.commit('second').hash
    git.switch('master')
    first = git.refDirectory.getFileByFilename(first.filename) || first
    first.content = 'master'
    git.add()
    git.commit('conflict')
    const result = git.merge({remote:false, branchName:'dev'})
    expect(result).toEqual('conflict occured, merge failed')
    expect(git.mergeHead).toEqual(devCommitHash)
    expect(git.conflicts.includes(first.filename)).toEqual(true)
    
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
    expect(git.refDirectory.getFilesByName([first.filename])[0].content.includes('dev')).toEqual(true)
    expect(git.refDirectory.getFilesByName([first.filename])[0].content.includes('master')).toEqual(true)
    git.add()
    git.commit('solve conflict')
    
    expect(git.mergeHead).toEqual('')
    expect(git.conflicts).toEqual([])
    console.log('after conflict', git.refDirectory.children[0].content)
  })
})
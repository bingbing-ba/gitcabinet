import { sha256 } from 'js-sha256'
import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'

describe('commit, tree', () => {
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

  it('first commit', ()=>{
    const {first, second, third} = initFiles()
    second.content = 'second'
    third.content = 'third'
    git.add()
    git.commit('add 3 files')
    const firstCommit = git.commits[git.branches[git.head]]
    expect(Object.keys(git.commits)[0]).toEqual(git.branches[git.head])
    expect(firstCommit.parent).toEqual([])
    expect(git.trees[firstCommit.tree]).toEqual({
      [first.filename]: sha256(first.content),
      [second.filename]: sha256(second.content),
      [third.filename]: sha256(third.content),
    })


  })

  it('multiple commit', ()=>{
    const {first, second, third} = initFiles()
    second.content = 'second'
    third.content = 'third'

    git.add([first.filename])
    git.commit('first')
    let headCommitHash = git.branches[git.head]
    let headCommit = git.commits[headCommitHash]
    expect(headCommit.parent).toEqual([])
    expect(git.trees[headCommit.tree]).toEqual({
      [first.filename]: sha256(first.content),
    })

    git.add([second.filename])
    git.commit('second')
    headCommit = git.commits[git.branches[git.head]]
    expect(headCommit.parent).toEqual([headCommitHash])
    expect(git.trees[headCommit.tree]).toEqual({
      [first.filename]: sha256(first.content),
      [second.filename]: sha256(second.filename),
    })
    headCommitHash = git.branches[git.head]

    git.add([third.filename])
    git.commit('third')
    headCommit = git.commits[git.branches[git.head]]
    expect(headCommit.parent).toEqual([headCommitHash])
    expect(git.trees[headCommit.tree]).toEqual({
      [first.filename]: sha256(first.content),
      [second.filename]: sha256(second.filename),
      [third.filename]: sha256(third.filename),
    })
  })

  it('no staged changes, no commit', () => {
    const {first, second, third} = initFiles()
    git.add()
    git.commit('first')
    const firstCommitHash = git.branches[git.head]
    first.content = 'modified'
    git.commit('second')
    const secondCommitHash = git.branches[git.head]
    expect(firstCommitHash).toEqual(secondCommitHash)
    expect(Object.keys(git.commits).length).toEqual(1)
  })
})
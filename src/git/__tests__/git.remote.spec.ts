import { sha256 } from 'js-sha256'
import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'
import { PushRejectedError } from '@/git/gitTypes'

describe('branch and merge', () => {
  let git: Git
  let origin: Git
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
    git = new Git(new Directory('remote'))
    origin = new Git(new Directory('origin'))
    git.addRemote('origin', origin)
  })

  it('set remote', () => {
    const upstream = new Git(new Directory('upstream'))
    git.addRemote('upstream', upstream)
    expect(git.config.remote).toEqual({ origin, upstream })
    expect(git.remoteBranches.origin).toEqual({})
  })

  it('fetch one branch, one commit', () => {
    const originFile = new PlainFile('originFile', origin.refDirectory)
    originFile.content = 'originFile'
    origin.add()
    const { hash } = origin.commit('origin first')
    const originFirstCommit = origin.commits[origin.branches[origin.head]]
    git.fetch('origin', 'master')
    expect(git.commits[hash]).toEqual(originFirstCommit)
    expect(git.trees[git.commits[hash].tree]).toEqual(
      origin.trees[originFirstCommit.tree]
    )
    expect(git.fileHashes[sha256(originFile.content)]).toEqual(originFile.content)
  })

  it('fetch one branch, multiple commits', () => {
    initFiles()
    git.add()
    git.commit('master first commit')
    const first = new PlainFile('first', origin.refDirectory)
    origin.add()
    origin.commit('first')
    origin.switch('second', {create:true})
    const second = new PlainFile('second', origin.refDirectory)
    origin.add()
    origin.commit('second')
    origin.switch('master')
    const third = new PlainFile('third', origin.refDirectory)
    origin.add()
    origin.commit('third')
    // non-ff no conflict, total commits of master: 4개(병합용 커밋 1 포함)
    origin.merge({remote:false, branchName:'second'})
    // only one commit at git , after fetch -> total commits: 5
    git.fetch('origin', 'master')
    expect(Object.keys(git.commits).length).toEqual(5)
  })

  it('fetch all branches', ()=>{
    const first = new PlainFile('first', origin.refDirectory)
    origin.add()
    origin.commit('first')
    origin.switch('second', {create:true})
    const second = new PlainFile('second', origin.refDirectory)
    origin.add()
    origin.commit('second')
    origin.switch('master')
    const third = new PlainFile('third', origin.refDirectory)
    origin.add()
    origin.commit('third')
    origin.merge({remote:false, branchName:'second'})
    const masterHead = origin.branches.master
    origin.switch('second')
    const fourth = new PlainFile('fourth', origin.refDirectory)
    origin.add()
    const {hash:secondHead} = origin.commit('fourth')
    git.fetch('origin')
    expect(Object.keys(git.commits).length).toEqual(5)
    expect(git.remoteBranches.origin?.master).toEqual(masterHead)
    expect(git.remoteBranches.origin?.second).toEqual(secondHead)
  })

  it('pull fast forward', ()=>{
    const first = new PlainFile('first', origin.refDirectory)
    first.content = 'git pull origin master'
    origin.add()
    const {hash} = origin.commit('first')
    git.pull('origin', 'master')
    expect(git.index[first.filename]).toEqual(sha256(first.content))
    expect(git.branches[git.head]).toEqual(hash)
    const second = new PlainFile('second', origin.refDirectory)
    second.content = 'second pull'
    origin.add()
    const {hash: secondHash} = origin.commit('second')
    git.pull('origin', 'master')
    expect(git.branches[git.head]).toEqual(secondHash)
  })

  it('pull when origin is behind of local', () => {
    const first = new PlainFile('first', origin.refDirectory)
    origin.add()
    origin.commit('first')
    git.pull('origin', 'master')
    const second = new PlainFile('second', git.refDirectory)
    git.add()
    const {hash} = git.commit('second')
    git.pull('origin', 'master')
    expect(git.branches[git.head]).toEqual(hash)
  })

  it('pull non fast forward', () => {
    const first = new PlainFile('first', origin.refDirectory)
    origin.add()
    origin.commit('first')
    git.pull('origin', 'master')
    const second = new PlainFile('second', git.refDirectory)
    second.content = 'second content'
    git.add()
    git.commit('second')
    const third = new PlainFile('third', origin.refDirectory)
    origin.add()
    origin.commit('third')
    git.pull('origin', 'master')
    expect(git.commits[git.branches[git.head]].parent.length).toEqual(2)
    expect(Object.keys(git.commits).length).toEqual(4)
    expect(git.index[second.filename]).toEqual(sha256(second.content))
    expect(git.index[third.filename]).toEqual(sha256(third.content))
  })

  it('push a commit', () => {
    initFiles()
    git.add()
    const {hash} = git.commit('first')
    git.push('origin', 'master')
    expect(hash).toEqual(origin.branches['master'])
  })

  it('push twice', () => {
    const {first, second, third} = initFiles()
    git.add([first.filename, second.filename])
    const {hash:firstHash} = git.commit('first, second')
    git.push('origin', 'master')
    const firstCommit = git.commits[git.branches[git.head]]
    git.add()
    const {hash:secondHash} = git.commit('third')
    git.push('origin', 'master')
    const secondCommit = git.commits[secondHash]
    expect(origin.branches[origin.head]).toEqual(secondHash)
    expect(origin.commits).toEqual({
      [firstHash]:firstCommit,
      [secondHash]:secondCommit,
    })
  })

  it('push rejected', () => {
    initFiles()
    git.add()
    git.commit('first commit')
    git.push('origin', 'master')
    new PlainFile('forth', origin.refDirectory)
    origin.add()
    origin.commit('second commit')
    new PlainFile('fifth', git.refDirectory)
    git.add()
    git.commit('third commit')
    expect(()=>git.push('origin','master')).toThrow(PushRejectedError)
  })

  it('push another branch', () => {
    git.switch('dev', {create:true})
    initFiles()
    git.add()
    const {hash} = git.commit('dev commit')
    git.push('origin', 'dev')
    expect(origin.branches['dev']).toEqual(hash)
  })
})

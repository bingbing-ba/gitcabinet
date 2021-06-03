import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'

describe('status', () => {
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

  it('1. status of unstaged files', () => {
    const README = new PlainFile('readme.txt', git.refDirectory)
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [README.filename],
        modified: [],
        deleted: [],
      },
      statusToCommit: {
        created: [],
        modified: [],
        deleted: [],
      },
    })
  })

  it('2. status of staged files', () => {
    const { first, second, third } = initFiles()
    git.add([first.filename])
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [second.filename, third.filename],
        modified: [],
        deleted: [],
      },
      statusToCommit: {
        created: [first.filename],
        modified: [],
        deleted: [],
      },
    })
  })

  it('3. status of commited files', () => {
    const { first, second, third } = initFiles()
    git.add([first.filename])
    git.commit('first')
    git.add([second.filename])
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [third.filename],
        modified: [],
        deleted: [],
      },
      statusToCommit: {
        created: [second.filename],
        modified: [],
        deleted: [],
      },
    })
  })

  it('4. status of modified files', () => {
    const { first, second } = initFiles()
    git.add()
    git.commit('all')
    first.content = 'modified first'
    second.content = 'modified second'
    git.add([first.filename])
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [],
        modified: [second.filename],
        deleted: [],
      },
      statusToCommit: {
        created: [],
        modified: [first.filename],
        deleted: [],
      },
    })
  })

  it('5. status of deleted files', () => {
    const { first, second, third } = initFiles()
    git.add()
    git.commit('all')
    git.refDirectory.delete(first)
    git.add([first.filename])
    git.refDirectory.delete(second)
    git.add()
    git.refDirectory.delete(third)
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [],
        modified: [],
        deleted: [third.filename],
      },
      statusToCommit: {
        created: [],
        modified: [],
        deleted: [first.filename, second.filename],
      },
    })
  })
})

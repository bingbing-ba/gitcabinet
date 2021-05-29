import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'

describe('git', () => {

  it('1. status of unstaged files', () => {
    const git = new Git(new Directory('status'))
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
    const git = new Git(new Directory('status'))
    const a = new PlainFile('a', git.refDirectory)
    const b = new PlainFile('b', git.refDirectory)
    git.add([a.filename])
    expect(git.status()).toEqual({
      statusNotToCommit: {
        unstaged: [b.filename],
        modified: [],
        deleted: [],
      },
      statusToCommit: {
        created: [a.filename],
        modified: [],
        deleted: [],
      },
    })
  })
})


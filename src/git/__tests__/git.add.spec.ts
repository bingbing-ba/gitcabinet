import { sha256 } from 'js-sha256'
import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'

describe('index and hashFiles when add', () => {
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

  it('add file', () => {
    const { first } = initFiles()
    git.add([first.filename])
    const hashedFirst = sha256(first.content)
    expect(git.index).toEqual({ [first.filename]: hashedFirst })
    expect(git.fileHashes).toEqual({ [hashedFirst]: first.content })
  })

  it('add files', () => {
    const { first, second } = initFiles()
    git.add([first.filename, second.filename])
    const hashedFirst = sha256(first.content)
    const hashedSecond = sha256(second.content)
    expect(git.index).toEqual({ 
      [first.filename]: hashedFirst,
      [second.filename]: hashedSecond,
    })
    expect(git.fileHashes).toEqual({ 
      [hashedFirst]: first.content,
      [hashedSecond]: second.content,
    })
  })

  it('add all', () => {
    const { first, second, third } = initFiles()
    third.content = 'modified third'
    git.add()
    const hashedFirst = sha256(first.content)
    const hashedSecond = sha256(second.content)
    const hashedThird = sha256(third.content)
    expect(git.index).toEqual({ 
      [first.filename]: hashedFirst,
      [second.filename]: hashedSecond,
      [third.filename]: hashedThird,
    })
    expect(git.fileHashes).toEqual({ 
      [hashedFirst]: first.content,
      [hashedSecond]: second.content,
      [hashedThird]: third.content,
    })
  })

  it('add deleted file', () => {
    const {first, second, third} = initFiles()
    git.add()
    git.refDirectory.delete(third)
    git.add()
    const hashed = sha256(first.content)
    expect(git.index).toEqual({ 
      [first.filename]: hashed,
      [second.filename]: hashed,
    })
    expect(git.fileHashes).toEqual({ 
      [hashed]: first.content,
    })
  })
})

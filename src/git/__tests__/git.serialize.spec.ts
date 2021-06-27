import { Git } from '@/git/git'
import { PlainFile, Directory } from '@/git/fileStructure'

describe('serialize git', () => {
  it('tojson', () => {
    const git = new Git(new Directory('git'))
    new PlainFile('first', git.refDirectory)
    new PlainFile('second', git.refDirectory)
    git.add(['first'])
    git.commit('fisrt')
    const gitJson = JSON.stringify(git)
    console.log(gitJson)
  })
})

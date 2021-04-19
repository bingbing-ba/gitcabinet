// dir 만들고
// 거기에 파일 몇개 만들어 넣고
// git init하고
// git status랑
// git add 해서 status랑 비교해서 잘 되는지 확인
import { PlainFile, Directory } from './fileStructure'
import { Git } from './git'


const presentDir = new Directory('test1')
const aTxt = new PlainFile('a.txt', presentDir)
const bTxt = new PlainFile('b.txt', presentDir)
const git = new Git(presentDir)

// a.txt, b.txt 둘 다 untracted, 새로생김
const firstStatus = git.status()
console.log('firstStatus, statusNotToCommit', firstStatus.statusNotToCommit)
console.log('firstStatus, statusToCommit', firstStatus.statusToCommit)
git.add(presentDir.getChildrenName())
// 현재 디렉토리 모두 add 한 상태
const secondStatus = git.status()
console.log('secondStatus, statusNotToCommit', secondStatus.statusNotToCommit)
console.log('secondStatus, statusToCommit', secondStatus.statusToCommit)
bTxt.content = 'updated bTxt'
// b.txt를 수정하고 아직 add하지 않은 상태
const thirdStatus = git.status()
console.log('thirdStatus, statusNotToCommit', thirdStatus.statusNotToCommit)
console.log('thirdStatus, statusToCommit', thirdStatus.statusToCommit)
console.log('third index', git.index)
presentDir.delete(bTxt)
// b.txt를 삭제하고 아직 add하지 않은 상태
const fourthStatus = git.status()
console.log('fourthStatus, statusNotToCommit', fourthStatus.statusNotToCommit)
console.log('fourthStatus, statusToCommit', fourthStatus.statusToCommit)
console.log('4th index', git.index)
git.commit('hello world')
// a.txt와 b.txt가 add되어 있는 상태로 commit했고 b.txt는 파일트리에서는 삭제된 상태
const fifthStatus = git.status()
console.log('fifthStatus, statusNotToCommit', fifthStatus.statusNotToCommit)
console.log('fifthStatus, statusToCommit', fifthStatus.statusToCommit)
console.log('5th index', git.index)
// add 된 거 없이 commit 했을 때
git.commit('no statusToCommit')
console.log('head, head branch, commits, commit', git.head, git.branches[git.head], git.commits, git.commits[git.branches[git.head]])
console.log('trees, filehashes', git.trees, git.fileHashes)

git.setUserConfig({type:'name', name:'bing'})
git.setUserConfig({type:'email', email:'bing@bing.bing'})

git.add(['b.txt'])
const sixthStatus = git.status()
console.log('sixthStatus, statusNotToCommit', sixthStatus.statusNotToCommit)
console.log('sixthStatus, statusToCommit', sixthStatus.statusToCommit)
console.log('sixthStatus of git.index', git.index)
git.commit('delete b.txt')
const seventhStatus = git.status()
console.log('seventhStatus, statusNotToCommit', seventhStatus.statusNotToCommit)
console.log('seventhStatus, statusToCommit', seventhStatus.statusToCommit)
console.log('head, head branch, commits, commit', git.head, git.branches[git.head], git.commits, git.commits[git.branches[git.head]])
console.log('trees, filehashes', git.trees, git.fileHashes)

aTxt.content = 'modified'
const cTxt = new PlainFile('c.txt', presentDir)
const eightthStatus = git.status()
console.log('eightthStatus, statusNotToCommit', eightthStatus.statusNotToCommit)
console.log('eightthStatus, statusToCommit', eightthStatus.statusToCommit)
git.add() // 현재 경로의 모든 변경사항 staging
const ninthStatus = git.status()
console.log('ninthStatus, statusNotToCommit', ninthStatus.statusNotToCommit)
console.log('ninthStatus, statusToCommit', ninthStatus.statusToCommit)
git.commit('modified and added with no argument')
const tenthStatus = git.status()
console.log('tenthStatus, statusNotToCommit', tenthStatus.statusNotToCommit)
console.log('tenthStatus, statusToCommit', tenthStatus.statusToCommit)
console.log('head, head branch, commits, commit', git.head, git.branches[git.head], git.commits)
console.log('trees, filehashes', git.trees, git.fileHashes)
import { PlainFile, Directory } from '@/git/fileStructure'

// PlainFile은 독자적으로 fromJSON으로 만들어낼 필요는 없음
describe('serialize Directory', () => {
  it('serialize and deserialize Directory', ()=>{
    const dirObj = new Directory('dir')
    const a = new PlainFile('a', dirObj)
    const b = new PlainFile('b', dirObj)
    b.content = `여러줄 파일
    헬로월드
    바이바이`
    const c = new PlainFile('c', dirObj)
    dirObj.delete(c)
    const dirJson = JSON.stringify(dirObj)
    const dirFromJson = Directory.fromJSON(dirJson)
    expect(dirObj).toEqual(dirFromJson)
  })
})
import { fileHashes, tree } from './gitTypes'

export class PlainFile {
  filename: string
  content: string
  parent: Directory

  constructor(filename: string, parent: Directory) {
    if (filename.includes(' ')) {
      throw new Error('Space is not allowed to File Name')
    }
    if (parent.isExist(filename)) {
      throw new Error('There is the same filename in this directory')
    }
    this.filename = filename
    this.content = ''
    this.parent = parent
    parent.add(this)
  }

  toString() {
    return this.filename
  }

  toJSON() {
    return {
      filename:this.filename,
      content:this.content,
      parent: this.parent.dirName,
    }
  }
}

export class Directory {
  children: PlainFile[]
  dirName: string

  constructor(dirName: string) {
    if (dirName.includes(' ')) {
      throw new Error('Space is not allowed to Directory Name!')
    }
    this.dirName = dirName
    this.children = []
  }

  toString() {
    return this.dirName
  }

  toJSON() {
    return {
      dirName: this.dirName,
      children: this.children,
    }
  }

  getChildrenName() {
    return this.children.join(' ').split(' ')
  }

  add(...children: PlainFile[]) {
    for (const child of children) {
      if (this.isExist(child.filename)) {
        throw new Error(`there is the same name of ${child.filename}`)
      }
      this.children.push(child)
    }
  }

  delete(child: PlainFile) {
    const childIndex = this.children.indexOf(child)
    if (childIndex === -1) {
      throw new Error('there is no such child')
    }
    this.children.splice(childIndex, 1)
  }

  getFilesByName(filenames: string[]) {
    const files: PlainFile[] = []
    for (const filename of filenames) {
      for (const child of this.children) {
        if (child.filename === filename) {
          files.push(child)
        }
      }
    }
    return files
  }

  isExist(filename: string) {
    for (const file of this.children) {
      if (file.filename === filename) {
        return true
      }
    }
    return false
  }

  clear() {
    this.children = []
  }

  setDirectoryByTree(tree: tree, fileHashes: fileHashes) {
    this.clear()
    for (const filename in tree) {
      const file = new PlainFile(filename, this)
      const fileContentHash = tree[filename]
      file.content = fileHashes[fileContentHash]
    }
  }

  /**
   * 파일이름으로 파일 찾아서 리턴, 없으면 undefined 리턴
   * @param filename 파일이름
   * @returns 파일객체 or undefined
   */
  getFileByFilename(filename:string){
    for (const child of this.children) {
      if (child.filename === filename) {
        return child
      }
    }
    return undefined
  }
}

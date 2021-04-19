export class PlainFile {
  filename: string
  content: string
  parent: Directory

  constructor(filename: string, parent: Directory) {
    if (filename.includes(' ')) {
      throw new Error('Space is not allowed to File Name')
    }
    this.filename = filename
    this.content = ''
    this.parent = parent
    parent.add(this)
  }

  toString() {
    return this.filename
  }
}

export class Directory {
  children: PlainFile []
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

  getChildrenName() {
    return this.children.join(' ').split(' ')
  }

  add(...children: PlainFile []) {
    for (const child of children) {
      if (this.isExist(child.filename)) {
        throw new Error(`there is the same name of ${child.filename}`)
      }
      this.children.push(child)
    }
  }

  delete(child: PlainFile ) {
    const childIndex = this.children.indexOf(child)
    if (childIndex === -1) {
      throw new Error('there is no such child')
    }
    this.children.splice(childIndex, 1)
  }

  getFilesByName(filenames: string []){
    const files:PlainFile[] = []
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
      if (file.filename === filename){
        return true
      }
    }
    return false
  }
}

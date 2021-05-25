/**
 * staging area입니다.
 * key는 파일 이름이고 value는 파일 내용을 hash한 값입니다.
 */
export interface index {
  [key: string]: string,
}

/**
 * branch 정보 객체입니다.
 * key에는 branch 이름이 오고(ex. master)
 * value에는 해당 브랜치의 가장 최신 commit hash값이 옵니다.
 */
export interface branches {
  [key: string]: string,
}

/**
 * tree 객체입니다. 
 * commit시점의 파일 상태를 기록하기 위해 사용합니다.
 * key는 파일이름, value는 파일내용을 hash한 값입니다.
 */
export interface tree {
  [key: string]: string,
}

/**
 * hash한 파일 내용을 원래대로 표시할 때 사용하는 객체입니다.
 * key는 파일 내용을 hash한 값, value는 원본 파일 내용입니다.
 */
export interface fileHashes {
  [key: string]: string,
}

/**
 * commit object입니다.
 * tree는 tree object에서 index로 쓸 수 있는 hash값,
 * parent는 부모 commit hash값입니다.
 * author는 username과 email로 이루어진 객체입니다.
 * createdAt은 작성시간입니다. Date.now()를 통해 만들어진 숫자입니다.
 * message는 커밋 메시지 입니다.
 */
export interface commit {
  tree: string
  parent: string[]
  author: {
    name: string,
    email: string,
  }
  createdAt: number,
  message: string
}


export interface nameConfig {
  type: 'name'
  name: string
}

export interface emailConfig {
  type: 'email'
  email: string
}

/**
 * config 설정에 쓰이는 userConfig입니다.
 */
export type userConfig = nameConfig | emailConfig

/**
 * index의 목록과 제일 최근 commit의 tree를 비교해서
 * value에 filename[]을 갖습니다.
 * created: index에만 있는 파일,
 * modified: filename은 같으나 content가 다른 파일,
 * deleted: tree에는 있으나 index에는 없는 파일
 */
export interface statusToCommit {
  created: string[]
  modified: string[]
  deleted: string[]
}
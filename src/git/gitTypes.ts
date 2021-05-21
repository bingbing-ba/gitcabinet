export interface stringObject {
  [key: string]: string,
}
/**
 * commit object입니다.
 * tree는 tree object에서 index로 쓸 수 있는 hash값,
 * parent는 부모 commit hash값입니다.
 * author와 message는 작성자와 커밋 메세지입니다.
 */
export interface commit {
  tree: string
  parent: string[]
  author: string
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
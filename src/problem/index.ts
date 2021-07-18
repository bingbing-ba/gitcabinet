import { Problem } from './problem'
import {
  initGit,
  basicAdd,
  basicCommit,
  userConfig,
  addAdvanced,
  addCommitPractice,
  addRemote,
  pushToRemote,
  pullFromRemote,
} from './problems'

const problems = [
  initGit,
  userConfig,
  basicAdd,
  basicCommit,
  addAdvanced,
  addCommitPractice,
  addRemote,
  pushToRemote,
  pullFromRemote,
]

export { Problem, problems }

<template>
  <div>
    <Problem/>
    <CLI/>
    <FileTree />
    <CommitGraph />
  </div>
</template>

<script>
import { Problem, CLI, FileTree, CommitGraph } from "./components";
import { Git } from "./git/git.ts"
import { PlainFile, Directory } from "./git/fileStructure.ts"

const rootDir = new Directory('rootDir')
const aTxt = new PlainFile('a.txt', rootDir)
const bTxt = new PlainFile('b.txt', rootDir)
const git = new Git(rootDir)
const status = git.status()
console.log(status, aTxt, bTxt)

export default {
  name: 'App',
  components: {
    Problem,
    CLI,
    FileTree,
    CommitGraph,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

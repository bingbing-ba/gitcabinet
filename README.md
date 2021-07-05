# gitcabinet
git을 처음 시작하는 사람들을 위한 과제 해결형 git simulator

## Project setup
```
$ npm ci
```
vue-cli가 만들어주는 package.json이 버전이 `^1.2.0` 이런식으로 되어있어서 그냥 `$ npm i` 하면 package-lock.json이 자꾸 바뀌어요. 위 명령어로 하시면 현재 package-lock.json 기반으로 모듈 설치됩니다.

## How To Test
```
$ npm run test:unit
```
테스트 파일은 원하는 곳에 `__tests__` 폴더를 만들고, 그 안에 `파일이름.spec.ts` or `파일이름.test.ts` 형식으로 작성하시면 됩니다.
작성 방법은 [vue-test-utils의 가이드](https://vue-test-utils.vuejs.org/guides/#getting-started)를 참고하세요.

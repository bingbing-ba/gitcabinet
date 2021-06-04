module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  testMatch: [
    "**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  moduleNameMapper:{
    '^.+\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  }
}
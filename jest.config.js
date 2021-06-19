module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  collectCoverageFrom: ['src/*'],
  setupFiles: ['./jest.setup-env.js']
}

// This file was is by @joelcox22/boilerplate - do not update manually in this repo.

module.exports = {
  transform: { '^.+\\.ts$': 'ts-jest' },
  globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } },
  testPathIgnorePatterns: ['/node_modules/', '/cdk.out/', '/dist/', '/lib'],
  setupFiles: ['./jest.setup-env.js'],
};

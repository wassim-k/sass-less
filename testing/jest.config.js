const { resolve } = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = resolve(__dirname, 'tsconfig.json');
const { compilerOptions } = require(tsconfig);

module.exports = {
  rootDir: '../',
  testEnvironment: 'jest-environment-node-single-context',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig }]
  },
  testMatch: ['<rootDir>/testing/**/*.spec.ts'],
  modulePathIgnorePatterns: ['dist'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${__dirname}/` })
};

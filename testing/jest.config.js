const { resolve } = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const tsconfig = resolve(__dirname, 'tsconfig.json');
const { compilerOptions } = require(tsconfig);

module.exports = {
  rootDir: '../',
  testEnvironment: 'node',
  globals: { 'ts-jest': { tsconfig } },
  transform: { '^.+\\.ts$': 'ts-jest' },
  testMatch: ['<rootDir>/testing/**/*.spec.ts'],
  modulePathIgnorePatterns: ['dist'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${__dirname}/` })
};

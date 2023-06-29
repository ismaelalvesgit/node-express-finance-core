import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
    verbose: true,
    automock: false,
    collectCoverage: true,
    coverageDirectory: "../coverage",
    coverageProvider: 'v8',
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],
    rootDir: 'src',
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    preset: 'ts-jest',
    setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts']
};
  
export default config;
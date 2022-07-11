const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './src' })

const customJestConfig = {
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts(x)?'],
  moduleNameMapper: {
    '^~/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^~/domains/(.*)$': '<rootDir>/src/domains/$1',
    '^~/theme/(.*)$': '<rootDir>/src/theme/$1'
  }
}

module.exports = createJestConfig(customJestConfig)

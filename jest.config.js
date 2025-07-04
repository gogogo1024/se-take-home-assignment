module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: './src',
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.{ts,js}', '!**/node_modules/**', '!**/dist/**']
};

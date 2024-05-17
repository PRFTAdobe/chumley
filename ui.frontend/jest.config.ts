export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': 'jest-transform-stub',
    '\\.(css|less|scss|sass)$': 'jest-transform-stub',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  automock: false,
  setupFiles: ['./setupJest.ts'],
};

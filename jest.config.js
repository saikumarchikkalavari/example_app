module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
      '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime.js',
      '^react$': '<rootDir>/node_modules/react',
      '^react-dom$': '<rootDir>/node_modules/react-dom',
      '^samplebundle/aggrid$': '<rootDir>/node_modules/samplebundle/dist/components/aggrid/index.js',
      '^samplebundle/tanstackquery$': '<rootDir>/node_modules/samplebundle/dist/tanstackquery/index.js',
      '^samplebundle$': '<rootDir>/node_modules/samplebundle/dist/index.js'

    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
};
 
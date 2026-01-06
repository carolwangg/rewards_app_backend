export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ['js', 'ts'],
  rootDir: "src",
  moduleDirectories: ['node_modules', '.'],
};
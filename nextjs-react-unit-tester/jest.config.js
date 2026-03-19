module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@evinced/unit-tester$": "<rootDir>/node_modules/@evinced/unit-tester/dist/index.js",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testTimeout: 15000
};

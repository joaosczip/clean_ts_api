module.exports = {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  transform: {
    ".+\\.ts$": "ts-jest"
  },
  testEnvironment: "node"
};

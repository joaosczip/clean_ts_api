module.exports = {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  transform: {
    ".+\\.ts$": "ts-jest"
  },
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  },
  preset: "@shelf/jest-mongodb"
};

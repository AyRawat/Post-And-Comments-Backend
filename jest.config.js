/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^db$": "<rootDir>/src/db/index.ts",
  },
  roots: ["<rootDir>/src"],
};

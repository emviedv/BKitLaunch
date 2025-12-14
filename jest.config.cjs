/** Jest configuration for unit and contract tests (jsdom). */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/client/src/__tests__/unit"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/test/jest/styleMock.js",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json", useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

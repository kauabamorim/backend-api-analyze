/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Set the test environment to Node.js
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest to transform TypeScript files
  },
  moduleFileExtensions: ["ts", "js"], // Recognize .ts and .js files
  clearMocks: true, // Automatically clear mock calls, instances, contexts, and results before every test
  collectCoverage: true, // Collect coverage information
  coverageDirectory: "coverage", // Output coverage files to the "coverage" directory
  coverageProvider: "v8", // Use v8 as the coverage provider
};

export default config;

import jest from "eslint-plugin-jest";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["cdk.out/**", "node_modules/**", "coverage/**", "jest.config.js"] },
  ...tseslint.configs.recommended,
  {
    // Test-quality rules required by the PSD testing standard (05-testing.md):
    // no assertion-free tests, no committed .only, no committed .skip.
    files: ["test/**/*.test.ts"],
    plugins: { jest },
    languageOptions: { globals: jest.environments.globals.globals },
    rules: {
      // CDK assertion tests assert via Template.hasResource*/templateMatches,
      // not expect() — count those as assertions.
      "jest/expect-expect": [
        "error",
        { assertFunctionNames: ["expect", "template.hasResource*", "template.templateMatches"] },
      ],
      "jest/no-focused-tests": "error",
      "jest/no-disabled-tests": "error",
    },
  },
);

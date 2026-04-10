const globals = require("globals");

module.exports = [
  {
    ignores: ["eslint.config.cjs"],
  },
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "commonjs",
      globals: {
        ...globals.commonjs,
        ...globals.es2015,
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      "no-const-assign": "warn",
      "no-this-before-super": "warn",
      "no-undef": "warn",
      "no-unreachable": "warn",
      "no-unused-vars": "warn",
      "constructor-super": "warn",
      "valid-typeof": "warn",
    },
  },
];

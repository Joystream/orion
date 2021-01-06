module.exports = {
  extends: ['@joystream/eslint-config'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'property',
        format: [], // Don't force format of object properties, so they can be ie.: { "Some thing": 123 }, { some_thing: 123 } etc.
      },
      {
        selector: 'accessor',
        format: ['camelCase', 'snake_case'],
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
      },
      {
        selector: 'typeLike',
        format: [],
        custom: { regex: '^([A-Z][a-z0-9]*_?)+', match: true }, // combined PascalCase and snake_case to allow ie. OpeningType_Worker
      },
      {
        selector: 'classMethod',
        modifiers: ['static'],
        format: ['PascalCase'],
      },
    ],
  },
  plugins: ['jest'],
  env: {
    'jest/globals': true,
  },
}

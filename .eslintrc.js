module.exports = {
  extends: [
    'standard',
    "plugin:jest/recommended",
    'plugin:prettier/recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",

    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: "es5",
        semi: false,
        tabWidth: 2
      }
    ]
  }
}

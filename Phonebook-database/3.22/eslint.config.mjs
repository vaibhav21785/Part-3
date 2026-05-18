export default [
  {
    files: ['**/*.js'],
    
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },

    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
  },
]
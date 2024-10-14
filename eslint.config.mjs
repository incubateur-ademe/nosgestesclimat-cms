import eslint from '@eslint/js'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
// eslint-disable-next-line import/no-unresolved
import typescriptEslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules/*', 'dist/*', '.strapi/*', 'types/generated/*'],
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_.*$',
          varsIgnorePattern: '^_.*$',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            ['internal', 'external', 'builtin'],
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
  },
]

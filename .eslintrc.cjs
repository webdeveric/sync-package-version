const tsconfig = require('./tsconfig.json');

const internalPathAliases = Object.keys(tsconfig.compilerOptions.paths)
  .map((path) => path.replaceAll(/^@|\/\*$/g, ''))
  .join(',');

module.exports = {
  root: true,
  extends: ['@webdeveric/eslint-config-ts', 'plugin:import/recommended', 'plugin:import/typescript', 'prettier'],
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: false,
    },
  },
  settings: {
    'import/extensions': ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs', '.json'],
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts', '.cts'],
    },
  },
  rules: {
    'spaced-comment': [
      'error',
      'always',
      {
        block: {
          markers: ['!'],
          balanced: true,
        },
      },
    ],
    'import/first': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-deprecated': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['./*.cjs', './*.ts', './*.mts', './*.mjs', '**/*.test.ts'],
      },
    ],
    'import/no-relative-packages': 'error',
    'import/no-self-import': 'error',
    'import/no-unresolved': 'error',
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: false,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true,
        },
        distinctGroup: false,
        groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index'], 'type', 'object'],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: `@{${internalPathAliases}}/**`,
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        warnOnUnassignedImports: true,
      },
    ],
    'sort-imports': 'off',
  },
  overrides: [
    {
      files: ['./*.cjs', './*.mjs', './*.ts', './*.mts'],
      parserOptions: {
        project: ['./tsconfig.project-files.json'],
      },
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': ['off'],
      },
    },
  ],
};

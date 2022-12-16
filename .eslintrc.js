module.exports = {
    env: {
        node: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['react', 'react-hooks', 'jsx-a11y'],
    extends: ['plugin:react-hooks/recommended', 'plugin:react/recommended', 'plugin:jsx-a11y/strict', 'prettier'],
    settings: {
        react: {
            version: '18.2.0',
        },
    },
    rules: {
        'react/prop-types': 1,
        'react/prop-types': [
            'warn',
            {
                skipUndeclared: true,
            },
        ],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
            extends: ['plugin:react-hooks/recommended', 'plugin:react/recommended', './.eslintrc-overrides.js', 'plugin:jsx-a11y/strict', 'prettier'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
    ],
};

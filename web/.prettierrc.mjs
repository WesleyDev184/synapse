/** @type {import('prettier').Config} */
const config = {
  // Code formatting
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',

  // Indentation and spacing
  tabWidth: 2,
  useTabs: false,

  // Line length
  printWidth: 80,

  // JSX specific
  jsxSingleQuote: true,

  // Other formatting options
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',

  // File extensions
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
}

export default config
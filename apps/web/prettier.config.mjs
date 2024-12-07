import prettierOptions from '@envoy1084/style-guide/prettier';

// eslint-disable-next-line tsdoc/syntax -- for type safety
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  ...prettierOptions,
  plugins: [...prettierOptions.plugins, 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cva'],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  useTabs: false,
  singleQuote: true,
  jsxSingleQuote: true,
  endOfLine: 'lf',
  printWidth: 80,
  importOrder: [
    '^next/(.*)$',
    '^react',
    '^~/lib/hooks/(.*)$',
    '^~/lib/helpers/(.*)$',
    '^~/lib/data/(.*)$',
    '^~/lib/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^~/components/(.*)$',
    '^~/assets/(.*)$',
    '^[./]',
    'lucide-react',
    '^~/types/(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;

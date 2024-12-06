import prettierOptions from '@envoy1084/style-guide/prettier';

const config = {
  ...prettierOptions,
  plugins: [...prettierOptions.plugins],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  useTabs: false,
  singleQuote: true,
  jsxSingleQuote: true,
  endOfLine: 'lf',
  printWidth: 80,
  importOrder: [
    '^react',
    '^~/lib/hooks/(.*)$',
    '^~/lib/helpers/(.*)$',
    '^~/lib/data/(.*)$',
    '^~/lib/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^~/components/(.*)$',
    '^~/assets/(.*)$',
    '^[./]',
    '^~/types/(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;

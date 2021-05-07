export const config = {
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.mjs',
  ],
  moduleNameMapper: {
    'node:(.*)': '$1',
  },
  moduleFileExtensions: [ 'js', 'mjs' ],
  testRegex: '.test.mjs$',
  transform: {},
};

export default config;

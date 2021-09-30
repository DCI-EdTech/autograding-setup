const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { boolean } = require('yargs')
const argv = yargs(hideBin(process.argv))
  .options({
    'lintingStringency': {
      alias: 'l',
      choices: ['low', 'medium', 'high'],
      default: 'high',
      describe: 'level of stricness for linting student solution code',
      type: 'string'
    },
    'dev': {
      type: 'boolean'
    }
  })
  .argv

module.exports = argv
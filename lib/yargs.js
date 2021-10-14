const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { execSync } = require('child_process')

const originExec = execSync('git remote get-url origin')
const origin = originExec.toString().trim()
const orgRegex = /DigitalCareerInstitute\/([^\/]+)\.git$/m
const isExerciseTemplate = origin.match(orgRegex).length > 0

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
      type: 'boolean',
      default: isExerciseTemplate,
    }
  })
  .argv

module.exports = argv
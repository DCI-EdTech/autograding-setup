const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { execSync } = require('child_process')

const originExec = execSync('git remote get-url origin')
const origin = originExec.toString().trim()
const branchExec = execSync('git rev-parse --abbrev-ref HEAD')
const branch = branchExec.toString().trim()
const orgRegex = /DigitalCareerInstitute\/([^\/]+)\.git$/m
const org = orgRegex.exec(origin)
const isExerciseTemplate = !!org
const repoInfo = origin.match(/(?:git@|https:\/\/)github.com[:/](.*).git/)[1]
const repoWebUrl = `https://github.com/${repoInfo}`

const argv = yargs(hideBin(process.argv))
  .options({
    'lintingStringency': {
      alias: 'l',
      choices: ['low', 'medium', 'high'],
      default: 'high',
      describe: 'level of stricness for linting student solution code',
      type: 'string'
    },
    'repoWebUrl': {
      default: repoWebUrl,
      type: 'string'
    },
    'branch': {
      default: branch,
      type: 'string'
    },
    'dev': {
      type: 'boolean',
      default: isExerciseTemplate,
    }
  })
  .argv

module.exports = argv
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yargs = yargs(hideBin(process.argv)).boolean(['dev']).argv

module.exports = yargs
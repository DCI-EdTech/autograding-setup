const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).boolean(['dev', 'CI']).argv

module.exports = argv
const fse = require('fs-extra');
const argv = require('../lib/yargs');
const devMode = argv.dev;
const { root } = require('../lib/refs')

exports.insertTemplateFiles = function(templateDir, ignoreList, outputPath) {
  console.log('Inserting autograding files');
  if(!devMode) fse.copySync(templateDir, root, { filter: (src, dest) => {
    console.log(src, dest)
    return true
  }});
  // .gitignore needs to be generated because of a bug in npm v7 https://github.com/npm/cli/issues/2144
  if(devMode) ignoreList.push('.gitignore', 'package-lock.json')
  fse.writeFileSync(outputPath, ignoreList.join('\n'));
}